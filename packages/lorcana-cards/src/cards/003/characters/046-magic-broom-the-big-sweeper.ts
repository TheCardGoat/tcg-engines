import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomTheBigSweeper: CharacterCard = {
  id: "xj7",
  cardType: "character",
  name: "Magic Broom",
  version: "The Big Sweeper",
  fullName: "Magic Broom - The Big Sweeper",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  text: "CLEAN SWEEP While this character is at a location, it gets +2 {S}.",
  cost: 3,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "78db2c30715f333eac7d1caefb10b0542be4c840",
  },
  abilities: [
    {
      id: "xj7-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "CLEAN SWEEP While this character is at a location, it gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
};
