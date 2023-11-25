const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Profile = require('../schemas/profile');
// [To-Do] Add a monster array list with different monster names and damages

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hunt')
		.setDescription('Fight a monster'),
	cooldown: '3',
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

        // [To-Do] Check if HP is below 0 and return an error

        // [To-Do] Edit the damage received when theres a monster array list
        const damageReceived = Math.floor((Math.random() * 10) + 1);
        const currentHealth = userProfile.hp + userProfile.def;
            const newHPAmount = currentHealth - damageReceived;

        // [To-Do] Use profile.atk to do damage to enemies

        const addXPAmount = Math.floor((Math.random() * 3) + 1);
        const addCoinAmount = Math.floor((Math.random() * 10) + 1);

        const embed = new EmbedBuilder()
            .setTitle(`${userField.username} slayed a {monster_type}`)
            .setDescription(`+ ${addXPAmount} XP\n+ ${addCoinAmount} coins`)
            .setFooter({ text: `${damageReceived} HP lost, ${newHPAmount}/100 HP remaining` })
            .setColor('#27821e');

        await Profile.updateOne({ _id: userProfile._id }, { $inc: { xp: addXPAmount, coin: addCoinAmount, hp: -damageReceived }}).catch(console.error);
            interaction.reply({ embeds: [embed] });
	}
};