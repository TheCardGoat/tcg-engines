import type { ActionCard } from "@tcg/lorcana-types";
import { seldomAllTheySeemI18n } from "./164-seldom-all-they-seem.i18n";

export const seldomAllTheySeem: ActionCard = {
  id: "2xE",
  canonicalId: "ci_2xE",
  reprints: ["set4-164"],
  cardType: "action",
  name: "Seldom All They Seem",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  cardNumber: 164,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c894fefd53624306a2a7f29942641a9c",
    tcgPlayer: 547771,
  },
  text: "Chosen character gets -3 {S} this turn.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -3,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "19i-1",
      text: "Chosen character gets -3 {S} this turn.",
      type: "action",
    },
  ],
  i18n: seldomAllTheySeemI18n,
};
