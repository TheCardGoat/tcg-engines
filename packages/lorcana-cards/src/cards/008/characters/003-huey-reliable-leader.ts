import type { CharacterCard } from "@tcg/lorcana-types";

export const hueyReliableLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1g4-1",
      name: "I KNOW THE WAY",
      text: "I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 3,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "bbdba91561e90d592503aba60cb421e17a31341a",
  },
  franchise: "Ducktales",
  fullName: "Huey - Reliable Leader",
  id: "1g4",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Huey",
  set: "008",
  strength: 2,
  text: "I KNOW THE WAY Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
  version: "Reliable Leader",
  willpower: 3,
};
