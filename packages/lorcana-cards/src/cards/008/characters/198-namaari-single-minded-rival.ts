import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariSinglemindedRival: CharacterCard = {
  id: "xx2",
  cardType: "character",
  name: "Namaari",
  version: "Single-Minded Rival",
  fullName: "Namaari - Single-Minded Rival",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "008",
  text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.\nEXTREME FOCUS This character gets +1 {S} for each card in your discard.",
  cost: 5,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 198,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7a3eeadf1fc2d88dab10fd80b99712cd1e20fd66",
  },
  abilities: [
    {
      id: "xx2-1",
      type: "triggered",
      name: "STRATEGIC EDGE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "STRATEGIC EDGE When you play this character and at the start of your turn, you may draw a card, then choose and discard a card.",
    },
    {
      id: "xx2-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "EXTREME FOCUS This character gets +1 {S} for each card in your discard.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Princess"],
};
