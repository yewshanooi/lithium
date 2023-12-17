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
                // Only display 10 items from the user's inventory
                const itemLimit = userInventory.item.slice(0, 10);
                const items = itemLimit.map(item => `**${item.name}** ${item.quantity}`).join('\n');

            if (userInventory.item && userInventory.item.length === 10) {
                inventoryEmbed.setDescription(items);
                inventoryEmbed.setFooter({ text: `Your inventory is full. Use the /sell command to clear some items.` });
            } else if (userInventory.item && userInventory.item.length > 0) {
                inventoryEmbed.setDescription(items);
            } else {
                inventoryEmbed.setDescription('No items found.');
            };

        await interaction.deferReply();
        return interaction.editReply({ embeds: [inventoryEmbed] });
	}
};