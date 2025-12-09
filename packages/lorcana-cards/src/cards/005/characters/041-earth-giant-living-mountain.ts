import type { CharacterCard } from "@tcg/lorcana";

export const earthGiantLivingMountain: CharacterCard = {
  id: "1xh",
  cardType: "character",
  name: "Earth Giant",
  version: "Living Mountain",
  fullName: "Earth Giant - Living Mountain",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "UNEARTHED When you play this character, each opponent draws a card.",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 41,
  inkable: true,
  externalIds: {
    ravensburger: "fa663265a818f52aa9dc5dccb009fec5fdcccae2",
  },
  abilities: [
    {
      id: "1xh-1",
      name: "UNEARTHED",
      text: "UNEARTHED When you play this character, each opponent draws a card.",
      type: "triggered",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
