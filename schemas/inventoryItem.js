const { Schema, model } = require('mongoose');
const inventoryItemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    type: String,
    quantity: Number
});

module.exports = model('InventoryItem', inventoryItemSchema, 'inventoryitems');