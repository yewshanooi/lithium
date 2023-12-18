const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');
const Profile = require('../schemas/profile');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Purchase items from the shop')
        .addStringOption(option => option.setName('item').setDescription('Enter an item to buy').setRequired(true))
        .addIntegerOption(option => option.setName('quantity').setDescription('Enter an amount').setRequired(true)),
	cooldown: '0',
	guildOnly: true,
	async execute (interaction) {
        const itemField = interaction.options.getString('item');
        const quantityField = interaction.options.getInteger('quantity');
		const userField = interaction.user;

        let userProfile = await Profile.findOne({
            userId: userField.id
        });

        if (userProfile === null) return interaction.reply({ embeds: [global.errors[0]] });

        let itemFound = global.shopItems[0].find(item => item.name === itemField);

        if (itemFound) {
            if (userProfile.coin < (quantityField * itemFound.price)) return interaction.reply({ embeds: [global.errors[4]] });

            const total = quantityField * itemFound.price;
            const coinsLeft = userProfile.coin - total;
                await Profile.updateOne({ _id: userProfile._id }, { $inc: { coin: -total }}).catch(console.error);

            try {
                const inventory = await Inventory.findOne({
                    userId: userField.id,
                    'item.name': itemFound.name
                });
            
                if (inventory) {
                    // If item already exists, increment its quantity
                    await Inventory.findOneAndUpdate({
                        userId: userField.id,
                        'item.name': itemFound.name
                    }, {
                        $inc: { 'item.$.quantity': quantityField }
                    });
                } else {
                    // If item does not exist, push a new item
                    await Inventory.findOneAndUpdate({
                        userId: userField.id
                    }, {
                        $push: {
                            item: {
                                name: itemFound.name,
                                quantity: quantityField
                            }
                        }
                    });
                }
                console.log(`[Lithium] Added ${quantityField} ${itemFound.name} to ${userField.username}'s inventory}`);
            } catch (err) {
                console.error(err);
            };

            const purchaseSuccess = new EmbedBuilder()
                .setTitle('Shop')
                .setDescription(`You have purchased **${quantityField}** ${itemFound.name}.`)
                .setFooter({ text: `You have ${coinsLeft} coins left` });

            await interaction.deferReply();
            return interaction.editReply({ embeds: [purchaseSuccess] });
        } else {
            return interaction.reply({ embeds: [global.errors[5]] });
        };

	}
};