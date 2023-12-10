const { Schema, model } = require('mongoose');
const inventoryItemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    quantity: Number
});

module.exports = model('InventoryItem', inventoryItemSchema, 'inventoryitems');