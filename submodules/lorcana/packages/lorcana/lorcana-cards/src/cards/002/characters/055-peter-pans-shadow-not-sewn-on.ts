import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPansShadowNotSewnOnI18n } from "./055-peter-pans-shadow-not-sewn-on.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { rush } from "../../../helpers/abilities/rush";

export const peterPansShadowNotSewnOn: CharacterCard = {
  id: "qvr",
  canonicalId: "ci_5eN",
  reprints: ["set2-055", "set9-042"],
  cardType: "character",
  name: "Peter Pan's Shadow",
  version: "Not Sewn On",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "002",
  cardNumber: 55,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_929d3fa7c5324a1dbc9ebc1d93bbee6d",
    tcgPlayer: 649989,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Rush",
    },
    {
      title: "TIPTOE",
      description: "Your other characters with Rush gain Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    rush,
    evasive,
    {
      id: "1n6-3",
      name: "TIPTOE",
      text: "TIPTOE Your other characters with Rush gain Evasive.",
      type: "static",
      effect: {
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: "all",
          excludeSelf: true,
          owner: "you",
          selector: "all",
          zones: ["play"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Rush",
            },
          ],
        },
        type: "gain-keyword",
      },
    },
  ],
  i18n: peterPansShadowNotSewnOnI18n,
};
