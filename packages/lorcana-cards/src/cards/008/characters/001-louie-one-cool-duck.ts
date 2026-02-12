import type { CharacterCard } from "@tcg/lorcana-types";

export const louieOneCoolDuck: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "SELF",
      },
      id: "1h7-1",
      text: "SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "bfc4c593e544a6b0caf1cd7927b3176a1b84f051",
  },
  franchise: "Ducktales",
  fullName: "Louie - One Cool Duck",
  id: "1h7",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Louie",
  set: "008",
  strength: 2,
  text: "SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.",
  version: "One Cool Duck",
  willpower: 3,
};
