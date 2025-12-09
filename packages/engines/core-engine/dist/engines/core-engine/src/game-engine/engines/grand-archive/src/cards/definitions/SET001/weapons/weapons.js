/**
 * Grand Archive SET001 Weapon Cards
 *
 * Equipment cards with power and durability
 */
/**
 * Flame Sword - Basic Fire Weapon
 */
export const flameSword = {
    id: "SET001-WEAPON-001",
    name: "Flame Sword",
    type: "weapon",
    set: "SET001",
    number: 31,
    rarity: "common",
    element: "fire",
    reserveCost: 2,
    power: 2,
    durability: 3,
    subtypes: ["Sword"],
    text: "A blade forged with elemental fire.",
    abilities: [
        {
            type: "triggered",
            effect: "When this weapon deals damage, deal 1 additional damage.",
            timing: "On damage",
        },
    ],
    implemented: true,
};
/**
 * Crystal Staff - Water Weapon
 */
export const crystalStaff = {
    id: "SET001-WEAPON-002",
    name: "Crystal Staff",
    type: "weapon",
    set: "SET001",
    number: 32,
    rarity: "common",
    element: "water",
    reserveCost: 2,
    power: 1,
    durability: 4,
    subtypes: ["Staff"],
    text: "A staff carved from pure crystal, channeling water's healing power.",
    abilities: [
        {
            type: "activated",
            cost: "Exhaust this weapon",
            effect: "Heal 2 damage from target champion or ally.",
        },
    ],
    implemented: true,
};
/**
 * Wind Blade - Wind Weapon
 */
export const windBlade = {
    id: "SET001-WEAPON-003",
    name: "Wind Blade",
    type: "weapon",
    set: "SET001",
    number: 33,
    rarity: "common",
    element: "wind",
    reserveCost: 2,
    power: 2,
    durability: 2,
    subtypes: ["Blade"],
    text: "A razor-sharp blade that cuts through air itself.",
    abilities: [
        {
            type: "static",
            effect: "Attacks with this weapon have Intercept.",
        },
    ],
    keywords: ["Intercept"],
    implemented: true,
};
/**
 * Runic Hammer - Norm Weapon
 */
export const runicHammer = {
    id: "SET001-WEAPON-004",
    name: "Runic Hammer",
    type: "weapon",
    set: "SET001",
    number: 34,
    rarity: "uncommon",
    element: "norm",
    reserveCost: 3,
    power: 3,
    durability: 4,
    subtypes: ["Hammer"],
    text: "An ancient hammer inscribed with powerful runes.",
    abilities: [
        {
            type: "static",
            effect: "This weapon has +1 power for each champion level you have.",
        },
    ],
    implemented: true,
};
/**
 * Arcane Orb - Advanced Element Weapon
 */
export const arcaneOrb = {
    id: "SET001-WEAPON-005",
    name: "Arcane Orb",
    type: "weapon",
    set: "SET001",
    number: 35,
    rarity: "rare",
    element: "arcane",
    reserveCost: 3,
    memoryCost: 1,
    power: 1,
    durability: 5,
    subtypes: ["Orb"],
    text: "A sphere of pure arcane energy, pulsing with magical power.",
    abilities: [
        {
            type: "triggered",
            effect: "When you cast an action, this weapon gains +1 power until end of turn.",
            timing: "On cast",
        },
        {
            type: "activated",
            cost: "Exhaust this weapon, pay 1 memory",
            effect: "Draw a card.",
        },
    ],
    implemented: true,
};
/**
 * Export all weapon cards
 */
export const WEAPONS = {
    [flameSword.id]: flameSword,
    [crystalStaff.id]: crystalStaff,
    [windBlade.id]: windBlade,
    [runicHammer.id]: runicHammer,
    [arcaneOrb.id]: arcaneOrb,
};
//# sourceMappingURL=weapons.js.map