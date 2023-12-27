const Discord = require('discord.js');

// global.errors[0]
const noUserDocument = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You are not registered with Lithium RPG. Use `/start` to get started.')
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

// global.errors[4]
const notEnoughCoins = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You do not have enough coins to buy this item.')
    .setColor('#ff5555')

// global.errors[5]
const itemNotFound = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('This item does not exist.')
    .setColor('#ff5555')

// global.errors[6]
const noHealthPotion = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You do not have a Health Potion.')
    .setColor('#ff5555')

// global.errors[7]
const alreadyFullHealth = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You already have **100** HP.')
    .setColor('#ff5555')

// global.errors[8]
const noHealth = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You do not have enough HP to do this.')
    .setColor('#ff5555')

// global.errors[9]
const alreadyEquipItem = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You already equipped this item.')
    .setColor('#ff5555')

// global.errors[10]
const cannotEquipItem = new Discord.EmbedBuilder()
    .setTitle('Error')
    .setDescription('You cannot equip this item.')
    .setColor('#ff5555')

module.exports = [noUserDocument, guildOnlyCommand, errorExecuting, databaseEmpty, notEnoughCoins, itemNotFound, noHealthPotion, alreadyFullHealth, noHealth, alreadyEquipItem, cannotEquipItem];