import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseFriendlyFace: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1xe-1",
      name: "GLAD YOU'RE HERE!",
      text: "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 13,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "f997fdb38a0d507a4edd3974df237ad743eb46f7",
  },
  fullName: "Mickey Mouse - Friendly Face",
  id: "1xe",
  inkType: ["amber"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Mickey Mouse",
  set: "002",
  strength: 1,
  text: "GLAD YOU'RE HERE! Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
  version: "Friendly Face",
  willpower: 6,
};
