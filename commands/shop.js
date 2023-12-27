const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Profile = require('../schemas/profile');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('View items available for purchase'),
	cooldown: '0',
	guildOnly: false,
	async execute (interaction) {
        const userField = interaction.user;

        let userProfile = await Profile.findOne({
            userId: userField.id
        });

        if (userProfile === null) return interaction.reply({ embeds: [global.errors[0]] });

        const embed = new EmbedBuilder()
            .setTitle(`Shop`)
            .setDescription(`Welcome to the Shop. Buy anything using \`/buy {item}\``)
            .setFooter({ text: `You have ${userProfile.coin} coins` });

            global.shopItems[0].forEach(item => {
                if (item.atk) {
                    embed.addFields({ name: `${item.name}   🪙 ${item.price}`, value: `ATK +${item.atk}\n*${item.description}*` });
                }
                else if (item.def) {
                    embed.addFields({ name: `${item.name}   🪙 ${item.price}`, value: `DEF +${item.def}\n*${item.description}*` });
                }
                else if (item.hp) {
                    embed.addFields({ name: `${item.name}   🪙 ${item.price}`, value: `HP +${item.hp}\n*${item.description}*` });
                }
                else {
                    embed.addFields({ name: `${item.name}   🪙 ${item.price}`, value: `*${item.description}*` });
                }
            });

            // [To-Do] Add a limit for a maximum of 25 embed fields.

        await interaction.deferReply();
        return interaction.editReply({ embeds: [embed] });
	}
};