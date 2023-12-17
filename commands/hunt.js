const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const Profile = require('../schemas/profile');

const monster = [
    { name: 'Slime', damage: 1 },
    { name: 'Rat', damage: 2 },
    { name: 'Bat', damage: 3 },
    { name: 'Spider', damage: 3 },
    { name: 'Zombie', damage: 5 },
    { name: 'Skeleton', damage: 7 },
    { name: 'Goblin', damage: 9 },
    { name: 'Dwarf', damage: 9 },
    { name: 'Imp', damage: 9 },
    { name: 'Giant Rat', damage: 11 },
    { name: 'White Wolf', damage: 13 },
    { name: 'Monkey', damage: 13 },
    { name: 'Revenant Imp', damage: 13 },
    { name: 'Minotaur', damage: 15 },
    { name: 'Scorpion', damage: 16 },
    { name: 'Mugger', damage: 18 },
    { name: 'Miner', damage: 18 },
    { name: 'Revenant Goblin', damage: 18 },
    { name: 'Thief', damage: 20 },
    { name: 'Pirate', damage: 23 },
    { name: 'Guard', damage: 25 },
    { name: 'Wizard', damage: 25 },
    { name: 'Vampire', damage: 25 },
    { name: 'Witch', damage: 25 },
    { name: 'Cyclops', damage: 25 },
    { name: 'Barbarian', damage: 27 },
    { name: 'Black Knight', damage: 28 },
    { name: 'Grizzly Bear', damage: 30 },
    { name: 'Cerberus', damage: 32 },
    { name: 'Icefiend', damage: 32 },
    { name: 'Fear Reaper', damage: 33 },
    { name: 'King Scorpion', damage: 33 },
    { name: 'Revenant Vampire', damage: 35 },
    { name: 'Ice Giant', damage: 38 },
    { name: 'Werewolf', damage: 38 },
    { name: 'Hellhound', damage: 38 },
    { name: 'Dragon', damage: 40 },
    { name: 'Revenant Dragon', damage: 45 }
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hunt')
		.setDescription('Fight a monster'),
	cooldown: '3',
	guildOnly: true,
	async execute (interaction) {
		const userField = interaction.user;
        const randomMonster = monster[Math.floor(Math.random() * monster.length)];

        let userProfile = await Profile.findOne({
            userId: userField.id
        });

        if (userProfile === null) {
            return interaction.reply({ embeds: [global.errors[0]] });
        }

        if (userProfile.hp === 0) {
            return interaction.reply({ embeds: [global.errors[8]] });
        }

        const damageReceived = randomMonster.damage;
        const currentHealth = userProfile.hp + userProfile.def;
            const newHPAmount = currentHealth - damageReceived;

        const addXPAmount = Math.floor((Math.random() * 3) + 1);
        const addCoinAmount = Math.floor((Math.random() * 10) + 1);

        if (damageReceived < currentHealth) {
            const embed = new EmbedBuilder()
                .setTitle(`${userField.username} slayed a ${randomMonster.name}`)
                .setDescription(`+ ${addXPAmount} XP\n+ ${addCoinAmount} coins`)
                .setFooter({ text: `${damageReceived} HP lost, ${newHPAmount}/100 HP remaining` })
                .setColor('#27821e');

            await Profile.updateOne({ _id: userProfile._id }, { $inc: { xp: addXPAmount, coin: addCoinAmount, hp: -damageReceived }}).catch(console.error);
                interaction.reply({ embeds: [embed] });
        } else {
            const currentCoins = userProfile.coin;

            const killedByMonster = new EmbedBuilder()
                .setTitle(`${userField.username} have been killed by a ${randomMonster.name}`)
                .setDescription(`\\- ${currentCoins} coins`)
                .setColor('#27821e');

            await Profile.updateOne({ _id: userProfile._id }, { $set: { coin: 0, hp: 0 }}).catch(console.error);
                interaction.reply({ embeds: [killedByMonster] });
        }

	}
};