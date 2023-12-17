const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Profile = require('../schemas/profile');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('heal')
		.setDescription('Heal using a Health Potion'),
	cooldown: '5',
	guildOnly: false,
	async execute (interaction) {
		const userField = interaction.user;

		let userProfile = await Profile.findOne({
            userId: userField.id
        });

		if (userProfile === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

		let userCurrentHealth = userProfile.hp;

		if (userCurrentHealth === 100) {
			return interaction.reply({ embeds: [global.errors[7]] });
		}

		let userInventory = await Inventory.findOne({
            userId: userField.id,
			'item.name': 'Health Potion'
        });

		if (!userInventory) {
			return interaction.reply({ embeds: [global.errors[6]] });
		}


		await Profile.findOneAndUpdate({
			userId: userField.id
		}, {
			$set: { hp: 100 }
		});

		await Inventory.findOneAndUpdate({
			userId: userField.id,
			'item.name': 'Health Potion'
		}, {
			$inc: { 'item.$.quantity': -1 }
		});

		const embed = new EmbedBuilder()
			.setTitle('Heal')
			.setDescription(`You healed yourself to **100** HP!`);

		return interaction.reply({ embeds: [embed] });
	}
};