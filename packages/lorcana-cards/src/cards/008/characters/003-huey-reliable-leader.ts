import type { CharacterCard } from "@tcg/lorcana-types";

export const hueyReliableLeader: CharacterCard = {
  id: "1g4",
  cardType: "character",
  name: "Huey",
  version: "Reliable Leader",
  fullName: "Huey - Reliable Leader",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "008",
  text: "I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 3,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "bbdba91561e90d592503aba60cb421e17a31341a",
  },
  abilities: [
    {
      id: "1g4-1",
      type: "triggered",
      name: "I KNOW THE WAY",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
