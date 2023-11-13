const Discord = require('discord.js');

// global.errors[0]
const noUserDocument = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('User doesn\'t have an existing entry in the database.\nType `/useradd {user}` to get started.')
    .setColor('#ff5555');

// global.errors[1]
const guildOnlyCommand = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('This command can only be used in a guild.')
    .setColor('#ff5555')

// global.errors[2]
const errorExecuting = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('There was an error while executing this command!')
    .setColor('#ff5555')

// global.errors[3]
const databaseEmpty = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('There is no existing entry in the database.')
    .setColor('#ff5555')

module.exports = [noUserDocument, guildOnlyCommand, errorExecuting, databaseEmpty];