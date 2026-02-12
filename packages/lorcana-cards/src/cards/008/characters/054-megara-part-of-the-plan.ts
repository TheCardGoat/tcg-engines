import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraPartOfThePlan: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "SELF",
        value: 2,
      },
      id: "d0s-1",
      text: "CONTENTIOUS ALLIANCE While you have a character named Hades in play, this character gains Challenger +2.",
      type: "action",
    },
  ],
  cardNumber: 54,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "2eeeaeb7efb064ae1053aabc43dfb7e198c93218",
  },
  franchise: "Hercules",
  fullName: "Megara - Part of the Plan",
  id: "d0s",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Megara",
  set: "008",
  strength: 2,
  text: "CONTENTIOUS ALLIANCE While you have a character named Hades in play, this character gains Challenger +2. (They get +2 {S} while challenging.)",
  version: "Part of the Plan",
  willpower: 5,
};
