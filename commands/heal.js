const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('heal')
		.setDescription('Heal using a Health Potion'),
	cooldown: '0',
	guildOnly: false,
	execute (interaction, configuration) {
		// [TODO] Check whether user have a health potion from inventory/inventoryItem schema
	}
};