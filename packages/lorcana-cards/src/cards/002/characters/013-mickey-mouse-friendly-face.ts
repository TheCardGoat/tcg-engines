import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseFriendlyFace: CharacterCard = {
  id: "1xe",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Friendly Face",
  fullName: "Mickey Mouse - Friendly Face",
  inkType: ["amber"],
  set: "002",
  text: "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
  cost: 6,
  strength: 1,
  willpower: 6,
  lore: 3,
  cardNumber: 13,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f997fdb38a0d507a4edd3974df237ad743eb46f7",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};
