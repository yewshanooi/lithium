const shopItems = [
    {
        name: 'Health Potion',
        description: 'Restore health points using /heal',
        type: 'Consumable',
        hp: 100,
        price: 25
    },
    {
        name: 'Wooden Armor',
        description: 'An armor made of wood',
        type: 'Armor',
        def: 5,
        price: 75
    },
    {
        name: 'Wooden Sword',
        description: 'A sword made of wood',
        type: 'Weapon',
        atk: 3,
        price: 100
    }
];

module.exports = [shopItems];