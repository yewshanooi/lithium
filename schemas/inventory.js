const { Schema, model } = require('mongoose');
const inventorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    userName: String,
    userId: String,
    guildId: String,
    wood: { type: Number, default: 0 },
    stone: { type: Number, default: 0 },
    fish: { type: Number, default: 0 },
    item: { type: String, default: null },
    consumable: { type: String, default: null }
});

module.exports = model('Inventory', inventorySchema, 'inventories');