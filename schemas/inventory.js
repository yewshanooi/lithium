const { Schema, model } = require('mongoose');
const inventoryItemSchema = require('./inventoryItem').schema;

const inventorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    userName: String,
    userId: String,
    item: [inventoryItemSchema]
});

module.exports = model('Inventory', inventorySchema, 'inventories');