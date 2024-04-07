const newLocal = require('fs');
const fs = newLocal;
const dotenv = require('dotenv');
	dotenv.config();
const chalk = require('chalk');
global.errors = require('./errors.js');
global.shopItems = require('./shopItems.js');

// Initialise mongoose npm package to manage MongoDB database
const mongoose = require('mongoose');

const { Client, Collection, EmbedBuilder, GatewayIntentBits, InteractionType, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] });
client.commands = new Collection();
const cooldowns = new Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const cmdFile of commandFiles) {
    const command = require(`./commands/${cmdFile}`);
    client.commands.set(command.data.name, command);
}


client.once('ready', client => {
	console.log(`${chalk.white.bold(`\nConnected to Discord as ${client.user.username}\nServing ${client.users.cache.size} user(s) and ${client.channels.cache.size} channel(s) in ${client.guilds.cache.size} guild(s)\n`)}`);
});


client.on('interactionCreate', async interaction => {
	const { client } = interaction;
    if (interaction.type !== InteractionType.ApplicationCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	// Outputs an error message if user tries to run a guild-only command in a Direct Message
	if (command.guildOnly && interaction.channel.type === 1) {
		return interaction.reply({ embeds: [global.errors[1]] });
	}

	// Outputs an error message if user tries to run a command that is still on a cooldown
	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;

				// Orange color embed
				const inCooldown = new EmbedBuilder()
					.setTitle('Cooldown')
					.setDescription(`Please wait \`${timeLeft.toFixed(1)}\` more second(s) before reusing the **${command.data.name}** command.`)
					.setColor('#ffaa00');
				return interaction.reply({ embeds: [inCooldown], ephemeral: true });
			}
		}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ embeds: [global.errors[2]] });
	}
});


// Mongoose Connection Event: Connecting
mongoose.connection.on('connecting', () => {
	console.log(`${chalk.greenBright.bold('[MongoDB] Connecting to database')}`)
});

// Mongoose Connection Event: Connected
mongoose.connection.on('connected', () => {
	console.log(`${chalk.greenBright.bold('[MongoDB] Successfully connected to database')}`)
});

// Mongoose Connection Event: Disconnected
mongoose.connection.on('disconnected', () => {
	console.log(`${chalk.redBright.bold('[MongoDB - Error] Disconnected from MongoDB')}`)
});

// Mongoose Connection Event: Error
mongoose.connection.on('error', (err) => {
	console.log(`${chalk.redBright.bold('[MongoDB - Error] There was a problem connecting to MongoDB')}`, err)
});


client.login(process.env.TOKEN);

// Asynchronous process to connect to MongoDB
(async () => {
	await mongoose.connect(process.env.MONGODB_TOKEN).catch(console.error);
})();