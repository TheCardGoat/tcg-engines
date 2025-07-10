/**
 * Alpha Clash Clash card definitions - Set 001
 *
 * Clash cards are combat units that can attack and obstruct.
 * They have attack and defense values and various keywords.
 */

import type { ClashCard } from "../../cardTypes";

export const stormtrooper: ClashCard = {
  id: "AC001-101",
  name: "Alpha Stormtrooper",
  type: "clash",
  set: "AC001",
  number: 101,
  rarity: "common",
  cost: 2,
  colors: ["white"],
  attack: 2,
  defense: 1,
  affiliations: ["alpha"],
  keywords: [],
  text: "When Alpha Stormtrooper enters play, you may search your deck for a basic resource card and put it into your Resource Zone.",
  flavorText: "Disciplined. Trained. Ready.",
  artist: "Alpha Artist",
  abilities: ["search_basic_resource"],
  subtypes: ["soldier"],
};

export const shadowBlade: ClashCard = {
  id: "AC001-102",
  name: "Shadow Blade",
  type: "clash",
  set: "AC001",
  number: 102,
  rarity: "uncommon",
  cost: 3,
  colors: ["black"],
  attack: 3,
  defense: 2,
  affiliations: ["rogue"],
  keywords: ["superspeed"],
  text: "Superspeed (This deals damage before cards without Superspeed)",
  flavorText: "Swift as shadow, sharp as steel.",
  artist: "Alpha Artist",
  abilities: [],
  subtypes: ["assassin"],
};

export const mysticOrb: ClashCard = {
  id: "AC001-103",
  name: "Mystic Orb",
  type: "clash",
  set: "AC001",
  number: 103,
  rarity: "common",
  cost: 1,
  colors: ["blue"],
  attack: 0,
  defense: 3,
  affiliations: ["harbinger"],
  keywords: ["flight"],
  text: "Flight (Can only be obstructed by cards with Flight or Interception). When Mystic Orb is played, draw a card.",
  flavorText: "Knowledge seeks its own path.",
  artist: "Alpha Artist",
  abilities: ["draw_on_play"],
  subtypes: ["construct"],
};

export const ironbarkGuardian: ClashCard = {
  id: "AC001-104",
  name: "Ironbark Guardian",
  type: "clash",
  set: "AC001",
  number: 104,
  rarity: "uncommon",
  cost: 4,
  colors: ["green"],
  attack: 3,
  defense: 5,
  affiliations: ["progenitor"],
  keywords: ["breakthrough"],
  text: "Breakthrough (Excess damage dealt by this card to obstructing cards is dealt to the opponent's Contender)",
  flavorText: "Ancient wood, harder than steel.",
  artist: "Alpha Artist",
  abilities: [],
  subtypes: ["guardian", "plant"],
};

export const chaosSpawn: ClashCard = {
  id: "AC001-105",
  name: "Chaos Spawn",
  type: "clash",
  set: "AC001",
  number: 105,
  rarity: "rare",
  cost: 5,
  colors: ["red"],
  attack: 6,
  defense: 4,
  affiliations: ["discarded"],
  keywords: ["enrage"],
  text: "Enrage 2 (This gets +2/+0 for each point of non-clash damage on it). When Chaos Spawn is defeated, deal 2 damage to all other Clash cards.",
  flavorText: "Born from the void between worlds.",
  artist: "Alpha Artist",
  abilities: ["damage_all_on_defeat"],
  subtypes: ["demon"],
};

export const crystallineDefender: ClashCard = {
  id: "AC001-106",
  name: "Crystalline Defender",
  type: "clash",
  set: "AC001",
  number: 106,
  rarity: "uncommon",
  cost: 3,
  colors: ["white", "blue"],
  attack: 2,
  defense: 4,
  affiliations: ["alpha", "harbinger"],
  keywords: ["interception"],
  text: "Interception (Can obstruct cards with Flight). Prevent the first 1 damage that would be dealt to Crystalline Defender each turn.",
  flavorText: "Crystal and steel, united in purpose.",
  artist: "Alpha Artist",
  abilities: ["prevent_first_damage"],
  subtypes: ["construct", "guardian"],
};

export const voidStalker: ClashCard = {
  id: "AC001-107",
  name: "Void Stalker",
  type: "clash",
  set: "AC001",
  number: 107,
  rarity: "rare",
  cost: 4,
  colors: ["black", "red"],
  attack: 4,
  defense: 3,
  affiliations: ["rogue", "discarded"],
  keywords: ["necrotic", "close-combat"],
  text: "Necrotic (When this deals damage to a Clash card, send that card to Oblivion after the clash). Close Combat (Can attack ready Clash cards)",
  flavorText: "It hunts between the spaces of reality.",
  artist: "Alpha Artist",
  abilities: [],
  subtypes: ["horror"],
};

export const arcaneSentinel: ClashCard = {
  id: "AC001-108",
  name: "Arcane Sentinel",
  type: "clash",
  set: "AC001",
  number: 108,
  rarity: "common",
  cost: 2,
  colors: ["blue"],
  attack: 1,
  defense: 4,
  affiliations: ["harbinger"],
  keywords: [],
  text: "When Arcane Sentinel obstructs, you may look at the top card of your deck. If it's a Quick Action, you may reveal and play it without paying its cost.",
  flavorText: "Ever watchful, ever ready.",
  artist: "Alpha Artist",
  abilities: ["free_quick_action_on_obstruct"],
  subtypes: ["sentinel", "construct"],
};

export const CLASH_CARDS = {
  [stormtrooper.id]: stormtrooper,
  [shadowBlade.id]: shadowBlade,
  [mysticOrb.id]: mysticOrb,
  [ironbarkGuardian.id]: ironbarkGuardian,
  [chaosSpawn.id]: chaosSpawn,
  [crystallineDefender.id]: crystallineDefender,
  [voidStalker.id]: voidStalker,
  [arcaneSentinel.id]: arcaneSentinel,
};
