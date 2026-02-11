import type { CharacterCard } from "@tcg/lorcana-types";

export const earthGiantLivingMountain: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "1xh-1",
      name: "UNEARTHED",
      text: "UNEARTHED When you play this character, each opponent draws a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 41,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "fa663265a818f52aa9dc5dccb009fec5fdcccae2",
  },
  franchise: "Frozen",
  fullName: "Earth Giant - Living Mountain",
  id: "1xh",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Earth Giant",
  set: "005",
  strength: 4,
  text: "UNEARTHED When you play this character, each opponent draws a card.",
  version: "Living Mountain",
  willpower: 5,
};
