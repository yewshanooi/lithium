const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chop')
		.setDescription('Chop a tree'),
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

        const woodAmount = Math.floor((Math.random() * 5) + 1);

        try {
            const inventory = await Inventory.findOne({
                userId: userField.id,
                'item.name': 'Wood'
            });

            if (inventory) {
                await Inventory.findOneAndUpdate({
                    userId: userField.id,
                    'item.name': 'Wood'
                }, {
                    $inc: { 'item.$.quantity': woodAmount }
                });
            } else {
                await Inventory.findOneAndUpdate({
                    userId: userField.id
                }, {
                    $push: {
                        item: {
                            name: 'Wood',
                            quantity: woodAmount
                        }
                    }
                });
            }
        } catch (err) {
            console.error(err);
        };

        const embed = new EmbedBuilder()
            .setTitle(`+ ${woodAmount} wood`)
            .setColor('#bc9862');

        return interaction.reply({ embeds: [embed] });
	}
};