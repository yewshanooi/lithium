const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Profile = require('../schemas/profile');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('View your profile'),
    cooldown: '0',
	async execute (interaction) {
		const userField = interaction.user;
        
        let userProfile = await Profile.findOne({
            userId: userField.id
        });

        if (userProfile === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const xpPerLevel = 100;
        const currentLevel = Math.floor(userProfile.xp / xpPerLevel);
        const currentLevelProgress = userProfile.xp % xpPerLevel;
        const nextLevelProgress = (currentLevelProgress / xpPerLevel) * 100;

        let weapon = userProfile.weapon ? `**${userProfile.weapon}**` : '*No weapon*';
            let weaponStatus = `${weapon}`;
        
        let armor = userProfile.armor ? `**${userProfile.armor}**` : '*No armor*';
            let armorStatus = `${armor}`;

        const profileEmbed = new EmbedBuilder()
            .setTitle(`${userField.username}'s Profile`)
            .addFields(
                { name: 'Progress', value: `**Level** ${currentLevel} (${nextLevelProgress.toFixed(1)}%)\n**XP** ${userProfile.xp}` },
                { name: 'Stats', value: `**ATK** ${userProfile.atk}\n**DEF** ${userProfile.def}\n**HP** ${userProfile.hp}` },
                { name: 'Equipment', value: `${weaponStatus}\n${armorStatus}`},
                { name: 'Coins', value: `🪙 ${userProfile.coin}` }
            );
        
        return interaction.reply({ embeds: [profileEmbed] });
	}
};