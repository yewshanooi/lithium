const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Profile = require('../schemas/profile');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('View your profile'),
    cooldown: '0',
    guildOnly: true,
	async execute (interaction) {
		const userField = interaction.user;
        
        let userProfile = await Profile.findOne({
            userId: userField.id,
            guildId: interaction.guild.id,
        });

        if (userProfile === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const profileEmbed = new EmbedBuilder()
            .setTitle(`${userField.username}'s Profile`)
            .addFields(
                { name: 'Progress', value: `**XP:** ${userProfile.xp}` },
                { name: 'Equipment', value: `${userProfile.weapon || 'No weapon'}\n${userProfile.armor || 'No armor'}`},
                { name: 'Stats', value: `**ATK:** ${userProfile.atk}\n**DEF:** ${userProfile.def}\n**HP:** ${userProfile.hp}` },
                { name: 'Coins', value: `${userProfile.coin}` }
            );
        interaction.reply({ embeds: [profileEmbed] });
	}
};