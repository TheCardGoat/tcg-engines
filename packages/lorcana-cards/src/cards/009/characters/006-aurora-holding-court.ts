import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraHoldingCourt: CharacterCard = {
  id: "1dm",
  cardType: "character",
  name: "Aurora",
  version: "Holding Court",
  fullName: "Aurora - Holding Court",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "009",
  text: "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b2e4454088493f11ad6048c6b396d2c646a96a35",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};
