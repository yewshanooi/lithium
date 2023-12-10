const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mine')
		.setDescription('Mine a rock'),
	cooldown: '30',
	guildOnly: true,
	async execute (interaction) {
		const userField = interaction.user;

        let userInventory = await Inventory.findOne({
            userId: userField.id
        });

        if (userInventory === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const stoneAmount = Math.floor((Math.random() * 5) + 1);

        try {
            const inventory = await Inventory.findOne({
                userId: userField.id,
                'item.name': 'Stone'
            });

            if (inventory) {
                await Inventory.findOneAndUpdate({
                    userId: userField.id,
                    'item.name': 'Stone'
                }, {
                    $inc: { 'item.$.quantity': stoneAmount }
                });
            } else {
                await Inventory.findOneAndUpdate({
                    userId: userField.id
                }, {
                    $push: {
                        item: {
                            name: 'Stone',
                            quantity: stoneAmount
                        }
                    }
                });
            }
        } catch (err) {
            console.error(err);
        };

        const embed = new EmbedBuilder()
            .setTitle(`+ ${stoneAmount} stone`)
            .setColor('#7f7f7f');

        return interaction.reply({ embeds: [embed] });
	}
};