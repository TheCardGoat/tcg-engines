import type { CharacterCard } from "@tcg/lorcana-types";

export const marshmallowTerrifyingSnowman: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      id: "1fi-1",
      text: "BEHEMOTH This character gets +1 {S} for each card in your hand.",
      type: "static",
    },
  ],
  cardNumber: 51,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "b9b57c518d4487484cbb0f68ce8ace42b5dfc9e7",
  },
  franchise: "Frozen",
  fullName: "Marshmallow - Terrifying Snowman",
  id: "1fi",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Marshmallow",
  set: "004",
  strength: 0,
  text: "BEHEMOTH This character gets +1 {S} for each card in your hand.",
  version: "Terrifying Snowman",
  willpower: 3,
};
