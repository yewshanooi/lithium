const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fish')
		.setDescription('Catch a fish'),
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

        const fishAmount = Math.floor((Math.random() * 5) + 1);

        try {
            const inventory = await Inventory.findOne({
                userId: userField.id,
                'item.name': 'Fish'
            });

            if (inventory) {
                await Inventory.findOneAndUpdate({
                    userId: userField.id,
                    'item.name': 'Fish'
                }, {
                    $inc: { 'item.$.quantity': fishAmount }
                });
            } else {
                await Inventory.findOneAndUpdate({
                    userId: userField.id
                }, {
                    $push: {
                        item: {
                            name: 'Fish',
                            quantity: fishAmount
                        }
                    }
                });
            }
        } catch (err) {
            console.error(err);
        };

        const embed = new EmbedBuilder()
            .setTitle(`+ ${fishAmount} fish`)
            .setColor('#6b9f93');

        return interaction.reply({ embeds: [embed] });
	}
};