const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Inventory = require('../schemas/inventory');
const Profile = require('../schemas/profile');
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Begin your journey with Lithium RPG'),
    cooldown: '0',
    guildOnly: true,
	async execute (interaction) {
		const userField = interaction.user;
        
        let userProfile = await Profile.findOne({
            userId: userField.id
        });

        if (!userProfile) {
            userProfile = await new Profile({
                _id: new mongoose.Types.ObjectId(),
                userName: userField.username,
                userId: userField.id
            });

            userInventory = await new Inventory({
                _id: new mongoose.Types.ObjectId(),
                userName: userField.username,
                userId: userField.id
            });

            await Promise.all([userProfile.save(), userInventory.save()]).then(() => {
                console.log(`${chalk.white.bold(`[Lithium] New User: ${userField.username} (${userField.id})`)}`);

                const welcomeMessage = new EmbedBuilder()
                    .setTitle(`Welcome to Lithium RPG, ${userField.username}!`)
                    .setDescription('Use `/help` to view all of the commands that will help you throughout your journey.');

                interaction.reply({ embeds: [welcomeMessage] });
            })
            .catch(console.error);
        return [userProfile, userInventory];
        } else {
            const userAlreadyExist = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('You have already begin your journey with us.')
                .setColor('#ff5555');

            interaction.reply({ embeds: [userAlreadyExist] });
        }
	}
};