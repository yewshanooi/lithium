const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mine')
		.setDescription('Mine a rock'),
	cooldown: '5',
	guildOnly: true,
	async execute (interaction) {
		const userField = interaction.user;

        let userInventory = await Inventory.findOne({
            userId: userField.id,
            guildId: interaction.guild.id,
        });

        if (userInventory === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const stoneAmount = Math.floor((Math.random() * 10) + 1);
            const newStoneAmount = userInventory.stone + stoneAmount;

        const embed = new EmbedBuilder()
            .setTitle(`+ ${stoneAmount} stone`)
            .setFooter({ text: `You have a total of ${newStoneAmount} stone` })
            .setColor('#7f7f7f');

        await Inventory.findOneAndUpdate({ _id: userInventory._id }, { $inc: { stone: stoneAmount }}).then(
            interaction.reply({ embeds: [embed] })
        )
        .catch(console.error);
	}
};