const { Schema, model } = require('mongoose');
const inventorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    userName: String,
    userId: String,
    guildId: String,
    item: String
});

module.exports = model('Inventory', inventorySchema, 'inventories');