import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomTheBigSweeper: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "xj7-1",
      text: "CLEAN SWEEP While this character is at a location, it gets +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 46,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 3,
  externalIds: {
    ravensburger: "78db2c30715f333eac7d1caefb10b0542be4c840",
  },
  franchise: "Fantasia",
  fullName: "Magic Broom - The Big Sweeper",
  id: "xj7",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Magic Broom",
  set: "003",
  strength: 1,
  text: "CLEAN SWEEP While this character is at a location, it gets +2 {S}.",
  version: "The Big Sweeper",
  willpower: 5,
};
