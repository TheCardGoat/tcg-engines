import type { CharacterCard } from "@tcg/lorcana-types";
import { hydrosIceTitanI18n } from "./039-hydros-ice-titan.i18n";

export const hydrosIceTitan: CharacterCard = {
  id: "vgI",
  canonicalId: "ci_vgI",
  reprints: ["set3-039"],
  cardType: "character",
  name: "Hydros",
  version: "Ice Titan",
  inkType: ["amethyst"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 39,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_fabf6b8091ab49a1b2dccff0b1bb66ab",
    tcgPlayer: 537614,
  },
  text: [
    {
      title: "BLIZZARD",
      description: "{E} — Exert chosen character.",
    },
  ],
  classifications: ["Storyborn", "Titan"],
  abilities: [
    {
      id: "vgI-1",
      name: "BLIZZARD",
      text: "BLIZZARD {E} — Exert chosen character.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: hydrosIceTitanI18n,
};
