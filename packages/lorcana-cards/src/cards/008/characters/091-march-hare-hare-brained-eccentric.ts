import type { CharacterCard } from "@tcg/lorcana-types";

export const marchHareHarebrainedEccentric: CharacterCard = {
  id: "12b",
  cardType: "character",
  name: "March Hare",
  version: "Hare-Brained Eccentric",
  fullName: "March Hare - Hare-Brained Eccentric",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "008",
  text: "LIGHT THE CANDLES When you play this character, you may deal 2 damage to chosen damaged character.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 91,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8a1715bb3a41a990bfa9cca9be698c8944be40d8",
  },
  abilities: [
    {
      id: "12b-1",
      type: "triggered",
      name: "LIGHT THE CANDLES",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "LIGHT THE CANDLES When you play this character, you may deal 2 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn"],
};
