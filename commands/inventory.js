const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('View your inventory'),
    cooldown: '0',
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

        const inventoryEmbed = new EmbedBuilder()
            .setTitle(`${userField.username}'s Inventory`)
            .setDescription(`${userInventory.wood || '0'} **wood**\n${userInventory.stone || '0'} **stone**\n${userInventory.fish || '0'} **fish**`)
            .addFields(
                { name: 'Items', value: `${userInventory.item || 'None'}` },
                { name: 'Consumables', value: `${userInventory.consumable || 'None'}` }
            );
        interaction.reply({ embeds: [inventoryEmbed] });
	}
};