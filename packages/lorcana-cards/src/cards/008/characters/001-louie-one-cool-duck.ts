import type { CharacterCard } from "@tcg/lorcana-types";

export const louieOneCoolDuck: CharacterCard = {
  id: "1h7",
  cardType: "character",
  name: "Louie",
  version: "One Cool Duck",
  fullName: "Louie - One Cool Duck",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "008",
  text: "SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 1,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bfc4c593e544a6b0caf1cd7927b3176a1b84f051",
  },
  abilities: [
    {
      id: "1h7-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "SELF",
      },
      text: "SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
