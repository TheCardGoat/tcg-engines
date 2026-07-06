import type { ActionCard } from "@tcg/lorcana-types";
import { focusedSearchI18n } from "./167-focused-search.i18n";

export const focusedSearch: ActionCard = {
  id: "Uhe",
  canonicalId: "ci_Uhe",
  slug: "lorcana-ci_Uhe",
  printings: [
    {
      id: "set13-167",
      artId: "set13-167",
      setCode: "set13",
      collectorNumber: "167",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-167"],
  cardType: "action",
  name: "Focused Search",
  inkType: ["sapphire"],
  franchise: "Up",
  set: "013",
  cardNumber: 167,
  rarity: "common",
  cost: 1,
  inkable: true,
  text: "Look at the top 4 cards of your deck. You may reveal a character card named Kevin or an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  abilities: [
    {
      type: "action",
      text: "Look at the top 4 cards of your deck. You may reveal a character card named Kevin or an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "or",
              filters: [
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "character",
                    },
                    {
                      type: "name",
                      equals: "Kevin",
                    },
                  ],
                },
                {
                  type: "card-type",
                  cardType: "item",
                },
              ],
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: focusedSearchI18n,
};
