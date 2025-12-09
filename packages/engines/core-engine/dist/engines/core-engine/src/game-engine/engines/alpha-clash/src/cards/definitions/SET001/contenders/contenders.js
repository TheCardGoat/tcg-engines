/**
 * Alpha Clash Contender card definitions - Set 001
 *
 * Contenders are each player's main character cards.
 * Rules:
 * - Exactly 1 per deck
 * - Player loses if Contender health reaches 0 or below
 * - Can attack and have abilities
 */
export const alphaWarrior = {
    id: "AC001-001",
    name: "Alpha Warrior",
    type: "contender",
    set: "AC001",
    number: 1,
    rarity: "legendary",
    cost: 0, // Contenders start in play
    colors: ["white"],
    startingHealth: 20,
    attack: 2,
    defense: 2,
    characterName: "Kai Thorne",
    affiliations: ["alpha"],
    keywords: ["undisputed"],
    text: "At the start of your turn, draw an additional card.",
    flavorText: "The first of the Alpha program, a beacon of hope in dark times.",
    artist: "Alpha Artist",
    abilities: ["draw_additional_card"],
};
export const rougeAssassin = {
    id: "AC001-002",
    name: "Rogue Assassin",
    type: "contender",
    set: "AC001",
    number: 2,
    rarity: "legendary",
    cost: 0,
    colors: ["black"],
    startingHealth: 18,
    attack: 3,
    defense: 1,
    characterName: "Shadow",
    affiliations: ["rogue"],
    keywords: ["superspeed"],
    text: "When Rogue Assassin deals damage to an opponent's Contender, that player discards a card.",
    flavorText: "Strike from the shadows, vanish without a trace.",
    artist: "Alpha Artist",
    abilities: ["opponent_discard_on_damage"],
};
export const harbingerMystic = {
    id: "AC001-003",
    name: "Harbinger Mystic",
    type: "contender",
    set: "AC001",
    number: 3,
    rarity: "legendary",
    cost: 0,
    colors: ["blue"],
    startingHealth: 19,
    attack: 1,
    defense: 3,
    characterName: "Zara Vex",
    affiliations: ["harbinger"],
    keywords: [],
    text: "Whenever you play a Quick Action, draw a card.",
    flavorText: "Knowledge flows through her like a river of stars.",
    artist: "Alpha Artist",
    abilities: ["draw_on_quick_action"],
};
export const progenitorTitan = {
    id: "AC001-004",
    name: "Progenitor Titan",
    type: "contender",
    set: "AC001",
    number: 4,
    rarity: "legendary",
    cost: 0,
    colors: ["green"],
    startingHealth: 25,
    attack: 3,
    defense: 4,
    characterName: "Gaia Prime",
    affiliations: ["progenitor"],
    keywords: ["breakthrough"],
    text: "At the end of your turn, if you control 3 or more Clash cards, gain 1 life.",
    flavorText: "Ancient power courses through every fiber of being.",
    artist: "Alpha Artist",
    abilities: ["life_gain_on_clash_cards"],
};
export const discardedOutcast = {
    id: "AC001-005",
    name: "Discarded Outcast",
    type: "contender",
    set: "AC001",
    number: 5,
    rarity: "legendary",
    cost: 0,
    colors: ["red"],
    startingHealth: 20,
    attack: 2,
    defense: 2,
    characterName: "Blaze",
    affiliations: ["discarded"],
    keywords: ["enrage"],
    text: "Enrage 1 (This gets +1/+0 for each point of non-clash damage on it)",
    flavorText: "Cast out, but never broken. Rage fuels the fight.",
    artist: "Alpha Artist",
    abilities: [],
};
export const CONTENDERS = {
    [alphaWarrior.id]: alphaWarrior,
    [rougeAssassin.id]: rougeAssassin,
    [harbingerMystic.id]: harbingerMystic,
    [progenitorTitan.id]: progenitorTitan,
    [discardedOutcast.id]: discardedOutcast,
};
//# sourceMappingURL=contenders.js.map