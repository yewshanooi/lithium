const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Profile = require('../schemas/profile');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('equip')
		.setDescription('Equip an item from your inventory')
        .addStringOption(option => option.setName('item').setDescription('Select an item to equip').setRequired(true)),
	cooldown: '0',
	async execute (interaction) {
        const itemField = interaction.options.getString('item');
		const userField = interaction.user;

		let userProfile = await Profile.findOne({
            userId: userField.id
        });

        let userInventory = await Inventory.findOne({
            userId: userField.id
        });

        if (userProfile === null) return interaction.reply({ embeds: [global.errors[0]] });

        let itemToEquip = userInventory.item.find(item => item.name === itemField);
            if (!itemToEquip) return interaction.reply({ content: 'Error: This item does not exist.' });

        // Check whether item is Weapon
        if (itemToEquip.type === 'Weapon') {
            if (userProfile.weapon) return interaction.reply({ content: 'Error: You already equipped this item.' });

            await Profile.findOneAndUpdate({
                userId: userField.id
            }, {
                $set: { 
                    weapon: itemField
                    // [To-Do] Set the new ATK value (by getting from shopItems array or add a new value field 'atk' in inventoryItem schema)
                }
            });

            const embed = new EmbedBuilder()
                .setTitle('Equip')
                .setDescription(`You have equipped ${itemField}.`);

            await interaction.deferReply();
            return interaction.editReply({ embeds: [embed] });
        }
        // Check whether item is Armor
        else if (itemToEquip.type === 'Armor') {
            if (userProfile.armor) return interaction.reply({ content: 'Error: You already equipped this item.' });

            await Profile.findOneAndUpdate({
                userId: userField.id
            }, {
                $set: { 
                    armor: itemField
                    // [To-Do] Set the new DEF value (by getting from shopItems array or add a new value field 'def' in inventoryItem schema)
                }
            });

            const embed = new EmbedBuilder()
                .setTitle('Equip')
                .setDescription(`You have equipped ${itemField}.`);

            await interaction.deferReply();
            return interaction.editReply({ embeds: [embed] });
        } 
        else {
            return interaction.reply({ content: 'Error: You cannot equip this item.' });
        }

	}
};