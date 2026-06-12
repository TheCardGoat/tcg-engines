import type { CharacterCard } from "@tcg/lorcana-types";
import { peteSpacePirateI18n } from "./114-pete-space-pirate.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const peteSpacePirate: CharacterCard = {
  id: "Ewo",
  canonicalId: "ci_Ewo",
  reprints: ["set7-114"],
  cardType: "character",
  name: "Pete",
  version: "Space Pirate",
  inkType: ["emerald", "steel"],
  set: "007",
  cardNumber: 114,
  rarity: "common",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_874601077b644699b9e61662ec1c68a8",
    tcgPlayer: 619468,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "FRIGHTFUL SCHEME",
      description:
        "While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Pirate"],
  abilities: [
    shift(4),
    {
      condition: {
        type: "exerted",
      },
      effect: {
        restriction: "cant-sing",
        target: "OPPOSING_CHARACTERS",
        type: "restriction",
      },
      id: "hmq-2",
      name: "FRIGHTFUL SCHEME",
      text: "FRIGHTFUL SCHEME While this character is exerted, opposing characters can't exert to sing songs and your Pirate characters gain Resist +1.",
      type: "static",
    },
    {
      condition: {
        type: "exerted",
      },
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          zones: ["play"],
          owner: "you",
          filter: [
            {
              type: "has-classification",
              classification: "Pirate",
            },
          ],
          count: "all",
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "hmq-3",
      name: "FRIGHTFUL SCHEME",
      text: "FRIGHTFUL SCHEME While this character is exerted, your Pirate characters gain Resist +1.",
      type: "static",
    },
  ],
  i18n: peteSpacePirateI18n,
};
