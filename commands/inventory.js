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
            userId: userField.id
        });

        if (userInventory === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        const inventoryEmbed = new EmbedBuilder()
            .setTitle(`${userField.username}'s Inventory`)

            userInventory.item = userInventory.item.filter(item => item.quantity > 0);

            if (userInventory.item && userInventory.item.length > 0) {
                const items = userInventory.item.map(item => `**${item.name}** ${item.quantity}`).join('\n');
                inventoryEmbed.setDescription(items);
            } else {
                inventoryEmbed.setDescription('No items found.');
            };

        await interaction.deferReply();
        return interaction.editReply({ embeds: [inventoryEmbed] });
	}
};