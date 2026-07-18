import type { CharacterCard } from "@tcg/op-types";
import { eb03Otama012I18n } from "./012-otama.i18n.ts";

export const eb03Otama012: CharacterCard = {
  id: "EB03-012",
  canonicalId: "EB03-012",
  slug: "otama/eb03-012",
  name: "Otama",
  printings: [
    {
      id: "EB03-012",
      artId: "EB03-012",
      setCode: "EB03",
      collectorNumber: "012",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-012_gGjJnoh.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB03",
  cost: 2,
  power: 0,
  counter: 2000,
  traits: ["Land of Wano"],
  attribute: "special",
  effect:
    "[Activate: Main] You may rest this Character: Rest up to 1 of your opponent's DON!! cards or {Animal} or {SMILE} type Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "rest",
                  target: {
                    player: "opponent",
                    zones: ["costArea"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                  },
                },
              ],
              [
                {
                  action: "rest",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "anyOf",
                        groups: [
                          [{ filter: "trait", value: "Animal", match: "includes" }],
                          [{ filter: "trait", value: "SMILE", match: "includes" }],
                        ],
                      },
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 3,
                      },
                    ],
                  },
                },
              ],
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Otama012I18n,
};
