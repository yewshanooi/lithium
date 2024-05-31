const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('View a specific command or all available commands')
		.addStringOption(option => option.setName('command').setDescription('Enter a command')),
	cooldown: '0',
	execute (interaction) {
		const { commands } = interaction.client;
        const commandField = interaction.options.getString('command');

		if (commandField) {
			const command = commands.get(commandField.toLowerCase());
			if (!command) return interaction.reply({ content: 'Error: No such command found.' });

			const commandEmbed = new EmbedBuilder()
				.setTitle(`/${command.data.name}`)
				.setDescription(`${command.data.description}`)
				.addFields({ name: 'Cooldown', value: `\`${command.cooldown}\` second(s)` });

			interaction.reply({ embeds: [commandEmbed] });
		}
		else {
			const mainEmbed = new EmbedBuilder()
				.setTitle('Help')
				.setDescription(`💡 *To get more info on a specific command use \`/help {command}\`*`)
				.addFields({ name: `There are ${commands.map(command => command.data.name).length} commands available`, value: `${commands.map(command => `\`${command.data.name}\``).join('\n')}` });

			interaction.reply({ embeds: [mainEmbed] });
		}

	}
};