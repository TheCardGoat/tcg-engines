import type { CharacterCard } from "@tcg/lorcana-types";
import { lythosRockTitanI18n } from "./180-lythos-rock-titan.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const lythosRockTitan: CharacterCard = {
  id: "Hi2",
  canonicalId: "ci_Hi2",
  reprints: ["set3-180"],
  cardType: "character",
  name: "Lythos",
  version: "Rock Titan",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 180,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_03d2c58be83e4132a95c060de2b00cbe",
    tcgPlayer: 537620,
  },
  text: [
    {
      title: "Resist +2",
    },
    {
      title: "STONE SKIN",
      description: "{E} — Chosen character gains Resist +2 this turn.",
    },
  ],
  classifications: ["Storyborn", "Titan"],
  abilities: [
    resist(2),
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Resist",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "ae9-2",
      name: "STONE SKIN",
      text: "STONE SKIN {E} — Chosen character gains Resist +2 this turn.",
      type: "activated",
    },
  ],
  i18n: lythosRockTitanI18n,
};
