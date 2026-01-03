import type { CharacterCard } from "@tcg/lorcana-types";

export const DrFacilierCharlatan: CharacterCard = {
  id: "fov",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Charlatan",
  fullName: "Dr. Facilier - Charlatan",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 38,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "static",
      text: "**Challenger** +2 (_When challenging, this character get +2 {S}._)",
      id: "fov-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  classifications: ["Sorcerer", "Storyborn", "Villain"],
};
