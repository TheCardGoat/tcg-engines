import type { CharacterCard } from "@tcg/lorcana-types";

export const marchHareHarebrainedEccentric: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "12b-1",
      name: "LIGHT THE CANDLES",
      text: "LIGHT THE CANDLES When you play this character, you may deal 2 damage to chosen damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 91,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 4,
  externalIds: {
    ravensburger: "8a1715bb3a41a990bfa9cca9be698c8944be40d8",
  },
  franchise: "Alice in Wonderland",
  fullName: "March Hare - Hare-Brained Eccentric",
  id: "12b",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "March Hare",
  set: "008",
  strength: 3,
  text: "LIGHT THE CANDLES When you play this character, you may deal 2 damage to chosen damaged character.",
  version: "Hare-Brained Eccentric",
  willpower: 4,
};
