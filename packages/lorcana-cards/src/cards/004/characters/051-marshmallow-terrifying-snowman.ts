import type { CharacterCard } from "@tcg/lorcana-types";

export const marshmallowTerrifyingSnowman: CharacterCard = {
  id: "1fi",
  cardType: "character",
  name: "Marshmallow",
  version: "Terrifying Snowman",
  fullName: "Marshmallow - Terrifying Snowman",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "004",
  text: "BEHEMOTH This character gets +1 {S} for each card in your hand.",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 51,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b9b57c518d4487484cbb0f68ce8ace42b5dfc9e7",
  },
  abilities: [
    {
      id: "1fi-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "BEHEMOTH This character gets +1 {S} for each card in your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
