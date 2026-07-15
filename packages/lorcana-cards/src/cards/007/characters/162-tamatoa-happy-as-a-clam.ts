import type { CharacterCard } from "@tcg/lorcana-types";

export const tamatoaHappyAsAClam: CharacterCard = {
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["item"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "return-to-hand",
      },
      id: "1i4-1",
      name: "COOLEST COLLECTION",
      text: "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "item",
          cost: "free",
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "1i4-2",
      text: "I'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.",
      type: "action",
    },
  ],
  cardNumber: 162,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "057d9e6259cdbcda8a49327ed4c68f557a42c3a4",
  },
  franchise: "Moana",
  fullName: "Tamatoa - Happy as a Clam",
  id: "1i4",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Tamatoa",
  set: "007",
  strength: 4,
  text: "COOLEST COLLECTION When you play this character, return up to 2 item cards from your discard to your hand.\nI'M BEAUTIFUL, BABY! Whenever this character quests, you may play an item for free.",
  version: "Happy as a Clam",
  willpower: 5,
};
