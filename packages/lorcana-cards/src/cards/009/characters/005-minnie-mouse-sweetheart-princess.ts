import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseSweetheartPrincess: CharacterCard = {
  id: "ofq",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Sweetheart Princess",
  fullName: "Minnie Mouse - Sweetheart Princess",
  inkType: ["amber"],
  set: "009",
  text: "ROYAL FAVOR Your characters named Mickey Mouse gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)\nBYE BYE, NOW Whenever this character quests, you may banish chosen exerted character with 5 {S} or more.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 5,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5812c94d096ef13f315d9acdc7694bd2e1352abc",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
