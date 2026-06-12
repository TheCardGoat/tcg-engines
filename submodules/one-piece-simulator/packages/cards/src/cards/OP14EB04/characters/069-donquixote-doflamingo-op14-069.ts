import type { CharacterCard } from "@tcg/op-types";
import { op14eb04DonquixoteDoflamingoOp14069069I18n } from "./069-donquixote-doflamingo-op14-069.i18n.ts";

export const op14eb04DonquixoteDoflamingoOp14069069: CharacterCard = {
  id: "OP14-069",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP14EB04",
  cost: 10,
  power: 10000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-069_p1_ueX6tig.jpg",
      imageId: "OP14-069_p1",
    },
  ],
  effect:
    "[On Play] DON!! -3: Choose one:\n•If your Leader has the {Donquixote Pirates} type, K.O. up to 1 of your opponent's Characters with a cost of 8 or less.\n•Up to 3 of your opponent's Characters with a cost of 7 or less cannot be rested until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 3,
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "ko",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 8,
                      },
                    ],
                  },
                },
              ],
              [
                {
                  action: "cannotBeRested",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 3,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "cost",
                        comparison: "lte",
                        value: 7,
                      },
                    ],
                  },
                  duration: "untilEndOfOpponentNextTurn",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04DonquixoteDoflamingoOp14069069I18n,
};
