import type { CharacterCard } from "@tcg/lorcana-types";

export const lingImperialSoldier: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "joz-1",
      name: "FULL OF SPIRIT Your Hero",
      text: "FULL OF SPIRIT Your Hero characters get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 183,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "46fab1f4f08af604245e97f1b80242c4b74024c3",
  },
  franchise: "Mulan",
  fullName: "Ling - Imperial Soldier",
  id: "joz",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ling",
  set: "004",
  strength: 3,
  text: "FULL OF SPIRIT Your Hero characters get +1 {S}.",
  version: "Imperial Soldier",
  willpower: 3,
};
