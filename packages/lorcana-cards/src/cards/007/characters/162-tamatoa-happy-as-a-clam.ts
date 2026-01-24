import type { CharacterCard } from "@tcg/lorcana-types";

export const tamatoaHappyAsAClam: CharacterCard = {
  id: "1i4",
  cardType: "character",
  name: "Tamatoa",
  version: "Happy as a Clam",
  fullName: "Tamatoa - Happy as a Clam",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "007",
  text: "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.\nI'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 162,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "057d9e6259cdbcda8a49327ed4c68f557a42c3a4",
  },
  abilities: [
    {
      id: "1i4-1",
      type: "triggered",
      name: "COOLEST COLLECTION",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
      text: "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.",
    },
    {
      id: "1i4-2",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "item",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "I'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
