import type { ItemCard } from "@tcg/lorcana-types";
import { peterPansDaggerI18n } from "./135-peter-pans-dagger.i18n";

export const peterPansDagger: ItemCard = {
  id: "USv",
  canonicalId: "ci_USv",
  reprints: ["set2-135"],
  cardType: "item",
  name: "Peter Pan's Dagger",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "002",
  cardNumber: 135,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d6f21fdca571497883e46666abc022bc",
    tcgPlayer: 527761,
  },
  text: "Your characters with Evasive get +1 {S}.",
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-keyword",
              keyword: "Evasive",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "hwz-1",
      text: "Your characters with Evasive get +1 {S}.",
      type: "static",
    },
  ],
  i18n: peterPansDaggerI18n,
};
