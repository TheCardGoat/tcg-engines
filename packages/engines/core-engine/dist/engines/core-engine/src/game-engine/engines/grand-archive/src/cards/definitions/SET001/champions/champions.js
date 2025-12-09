/**
 * Grand Archive SET001 Champion Cards
 *
 * Initial champion cards for testing and development
 */
/**
 * Test Fire Champion - Level 0
 */
export const testFireChampion = {
    id: "SET001-CHAMPION-001",
    name: "Ember Initiate",
    type: "champion",
    set: "SET001",
    number: 1,
    rarity: "common",
    element: "fire",
    level: 0,
    life: 25,
    championClass: ["Mage"],
    domainIdentity: ["fire"],
    reserveCost: 0,
    text: "A novice mage learning to harness the power of fire.",
    abilities: [
        {
            type: "static",
            effect: "Your Fire cards cost 1 less to materialize.",
        },
    ],
    implemented: true,
};
/**
 * Test Water Champion - Level 0
 */
export const testWaterChampion = {
    id: "SET001-CHAMPION-002",
    name: "Tide Caller",
    type: "champion",
    set: "SET001",
    number: 2,
    rarity: "common",
    element: "water",
    level: 0,
    life: 25,
    championClass: ["Cleric"],
    domainIdentity: ["water"],
    reserveCost: 0,
    text: "A mystic who channels the flow of water to heal and protect.",
    abilities: [
        {
            type: "activated",
            cost: "Rest this champion",
            effect: "Heal 2 damage from target champion or ally.",
        },
    ],
    implemented: true,
};
/**
 * Test Wind Champion - Level 0
 */
export const testWindChampion = {
    id: "SET001-CHAMPION-003",
    name: "Gale Rider",
    type: "champion",
    set: "SET001",
    number: 3,
    rarity: "common",
    element: "wind",
    level: 0,
    life: 25,
    championClass: ["Ranger"],
    domainIdentity: ["wind"],
    reserveCost: 0,
    text: "A swift warrior who moves with the wind itself.",
    abilities: [
        {
            type: "static",
            effect: "Your allies with Flying cost 1 less to materialize.",
        },
    ],
    implemented: true,
};
/**
 * Test Dual-Element Champion - Level 1
 */
export const testDualChampion = {
    id: "SET001-CHAMPION-004",
    name: "Elemental Savant",
    type: "champion",
    set: "SET001",
    number: 4,
    rarity: "rare",
    element: "arcane",
    level: 1,
    life: 30,
    championClass: ["Mage", "Scholar"],
    domainIdentity: ["fire", "water"],
    reserveCost: 2,
    memoryCost: 1,
    text: "A master of elemental fusion, wielding fire and water in harmony.",
    abilities: [
        {
            type: "triggered",
            effect: "When this champion levels up, draw a card.",
            timing: "On level up",
        },
        {
            type: "activated",
            cost: "Exhaust, pay 1 memory",
            effect: "Deal 1 damage to target champion or ally, then heal 1 damage from another target.",
        },
    ],
    implemented: true,
};
/**
 * Export all champion cards
 */
export const CHAMPIONS = {
    [testFireChampion.id]: testFireChampion,
    [testWaterChampion.id]: testWaterChampion,
    [testWindChampion.id]: testWindChampion,
    [testDualChampion.id]: testDualChampion,
};
//# sourceMappingURL=champions.js.map