const Discord = require('discord.js');

const noUserDocument = new Discord.EmbedBuilder()           // global.errors[0]
    .setTitle('Error')
    .setDescription('You are not registered with Lithium RPG. Use `/start` to get started.')
    .setColor('#ff5555');

const errorExecuting = new Discord.EmbedBuilder()           // global.errors[1]
    .setTitle('Error')
    .setDescription('There was an error while executing this command!')
    .setColor('#ff5555')

module.exports = [noUserDocument, errorExecuting];