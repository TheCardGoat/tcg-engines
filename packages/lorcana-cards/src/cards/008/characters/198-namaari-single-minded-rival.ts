import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariSinglemindedRival: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "xx2-1",
      name: "STRATEGIC EDGE",
      text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "xx2-2",
      text: "EXTREME FOCUS This character gets +1 {S} for each card in your discard.",
      type: "static",
    },
  ],
  cardNumber: 198,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "7a3eeadf1fc2d88dab10fd80b99712cd1e20fd66",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Namaari - Single-Minded Rival",
  id: "xx2",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Namaari",
  set: "008",
  strength: 0,
  text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.\nEXTREME FOCUS This character gets +1 {S} for each card in your discard.",
  version: "Single-Minded Rival",
  willpower: 5,
};
