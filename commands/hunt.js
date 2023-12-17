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
    { name: 'Imp', damage: 10 },
    { name: 'Giant Rat', damage: 10 },
    { name: 'White Wolf', damage: 11 },
    { name: 'Monkey', damage: 12 },
    { name: 'Minotaur', damage: 13 },
    { name: 'Scorpion', damage: 15 },
    { name: 'Mugger', damage: 16 },
    { name: 'Miner', damage: 18 },
    { name: 'Thief', damage: 20 },
    { name: 'Pirate', damage: 23 },
    { name: 'Guard', damage: 25 },
    { name: 'Wizard', damage: 25 },
    { name: 'Vampire', damage: 25 },
    { name: 'Witch', damage: 25 },
    { name: 'Cyclops', damage: 26 },
    { name: 'Barbarian', damage: 26 },
    { name: 'Black Knight', damage: 27 },
    { name: 'Grizzly Bear', damage: 28 },
    { name: 'Cerberus', damage: 30 },
    { name: 'Icefiend', damage: 32 },
    { name: 'Fear Reaper', damage: 33 },
    { name: 'King Scorpion', damage: 35 },
    { name: 'Ice Giant', damage: 38 },
    { name: 'Werewolf', damage: 40 },
    { name: 'Hellhound', damage: 43 },
    { name: 'Dragon', damage: 45 }
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
        const revenant = Math.floor(Math.random() * 10);
            let resultMonster;
                // A 10% chance to get the Revenant variant
                if (revenant >= 9) resultMonster = `Revenant ${randomMonster.name}`;
                else resultMonster = randomMonster.name;

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
            // Damage Received is lesser than Current Health (Alive)
            const embed = new EmbedBuilder()
                .setTitle(`${userField.username} slayed a ${resultMonster}`)
                .setDescription(`+ ${addXPAmount} XP\n+ ${addCoinAmount} coins`)
                .setFooter({ text: `${damageReceived} HP lost, ${newHPAmount}/100 HP remaining` })
                .setColor('#27821e');

            await Profile.updateOne({ _id: userProfile._id }, { $inc: { xp: addXPAmount, coin: addCoinAmount, hp: -damageReceived } }).catch(console.error);
                interaction.reply({ embeds: [embed] });
        } else {
            // Damage Received is more than Current Health (Dead)
            const killedByMonster = new EmbedBuilder()
                .setTitle(`${userField.username} have been killed by a ${resultMonster}`)
                .setColor('#27821e');

            if (userProfile.coin === 0) {
                // If user doesn't have any coins, set HP to 0
                await Profile.updateOne({ _id: userProfile._id }, { $set: { hp: 0 } }).catch(console.error);
                interaction.reply({ embeds: [killedByMonster] });
            } else {
                // If user have coins, set HP to 0 and set Coins to a new amount (check whether user have enough Coins to remove)
                const removeCoinAmount = Math.floor((Math.random() * 100) + 1);
                    const smallestAmount = Math.min(removeCoinAmount, userProfile.coin);
                    const newRemoveCoinAmount = userProfile.coin - smallestAmount;

                killedByMonster.setDescription(`\\- ${smallestAmount} coins`)
                killedByMonster.setFooter({ text: `You have ${newRemoveCoinAmount} coins left` });

                await Profile.updateOne({ _id: userProfile._id }, { $set: { hp: 0, coin: newRemoveCoinAmount } }).catch(console.error);
                interaction.reply({ embeds: [killedByMonster] });
            }

        }

	}
};