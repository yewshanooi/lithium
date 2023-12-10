const { Schema, model } = require('mongoose');
const inventoryItemSchema = require('./inventoryItem').schema;

const inventorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    userName: String,
    userId: String,
    wood: { type: Number, default: 0 },
    stone: { type: Number, default: 0 },
    fish: { type: Number, default: 0 },
    item: [inventoryItemSchema]
});

module.exports = model('Inventory', inventorySchema, 'inventories');