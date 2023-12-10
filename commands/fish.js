const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fish')
		.setDescription('Catch a fish'),
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

        const fishAmount = Math.floor((Math.random() * 10) + 1);
            const newFishAmount = userInventory.fish + fishAmount;

        const embed = new EmbedBuilder()
            .setTitle(`+ ${fishAmount} fish`)
            .setFooter({ text: `You have a total of ${newFishAmount} fish` })
            .setColor('#6b9f93');

        await Inventory.findOneAndUpdate({ _id: userInventory._id }, { $inc: { fish: fishAmount }}).then(
            interaction.reply({ embeds: [embed] })
        )
        .catch(console.error);
	}
};