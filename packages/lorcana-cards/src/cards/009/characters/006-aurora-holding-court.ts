import type { CharacterCard } from "@tcg/lorcana-types";

export const auroraHoldingCourt: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1dm-1",
      name: "ROYAL WELCOME",
      text: "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 6,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 1,
  externalIds: {
    ravensburger: "b2e4454088493f11ad6048c6b396d2c646a96a35",
  },
  franchise: "Sleeping Beauty",
  fullName: "Aurora - Holding Court",
  id: "1dm",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Aurora",
  set: "009",
  strength: 1,
  text: "ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.",
  version: "Holding Court",
  willpower: 2,
};
