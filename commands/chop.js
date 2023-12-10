const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chop')
		.setDescription('Chop a tree'),
	cooldown: '5',
	guildOnly: true,
	async execute (interaction) {
		const userField = interaction.user;

        let userInventory = await Inventory.findOne({
            userId: userField.id
        });

        if (userInventory === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const woodAmount = Math.floor((Math.random() * 10) + 1);
            const newWoodAmount = userInventory.wood + woodAmount;

        const embed = new EmbedBuilder()
            .setTitle(`+ ${woodAmount} wood`)
            .setFooter({ text: `You have a total of ${newWoodAmount} wood` })
            .setColor('#bc9862');

        await Inventory.findOneAndUpdate({ _id: userInventory._id }, { $inc: { wood: woodAmount }}).then(
            interaction.reply({ embeds: [embed] })
        )
        .catch(console.error);
	}
};