import type { CharacterCard } from "@tcg/lorcana-types";
import { marshmallowTerrifyingSnowmanI18n } from "./051-marshmallow-terrifying-snowman.i18n";

export const marshmallowTerrifyingSnowman: CharacterCard = {
  id: "cKU",
  canonicalId: "ci_cKU",
  reprints: ["set4-051"],
  cardType: "character",
  name: "Marshmallow",
  version: "Terrifying Snowman",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 51,
  rarity: "uncommon",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4539b94483584e5591a52ff5f95348ae",
    tcgPlayer: 549442,
  },
  text: [
    {
      title: "BEHEMOTH",
      description: "This character gets +1 {S} for each card in your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: {
          type: "cards-in-hand",
          controller: "you",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1fi-1",
      name: "BEHEMOTH",
      text: "BEHEMOTH This character gets +1 {S} for each card in your hand.",
      type: "static",
    },
  ],
  i18n: marshmallowTerrifyingSnowmanI18n,
};
