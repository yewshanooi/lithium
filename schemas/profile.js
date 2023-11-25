const { Schema, model } = require('mongoose');
const profileSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userName: String,
    userId: String,
    guildId: String,
    xp: { type: Number, default: 0 },
    weapon: { type: String, default: null },
    armor: { type: String, default: null },
    atk: { type: Number, default: 1 },
    def: { type: Number, default: 0 },
    hp: { type: Number, default: 100 },
    coin: { type: Number, default: 0 },
});

module.exports = model('Profile', profileSchema, 'profiles');