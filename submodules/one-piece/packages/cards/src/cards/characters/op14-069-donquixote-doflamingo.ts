import type { CharacterCard } from "@tcg/op-types";
import { op14eb04DonquixoteDoflamingoOp14069069I18n } from "./op14-069-donquixote-doflamingo.i18n.ts";

export const op14eb04DonquixoteDoflamingoOp14069069: CharacterCard = {
  id: "OP14-069",
  canonicalId: "OP14-069",
  slug: "donquixote-doflamingo/op14-069",
  name: "Donquixote Doflamingo",
  printings: [
    {
      id: "OP14-069",
      artId: "OP14-069",
      setCode: "OP14",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-069_NfkEOhR.jpg",
      label: "Donquixote Doflamingo - OP14-069",
    },
    {
      id: "OP14-069_p1",
      artId: "OP14-069_p1",
      setCode: "OP14",
      collectorNumber: "069",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-069_p1_ueX6tig.jpg",
      label: "Donquixote Doflamingo - OP14-069 (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP14",
  cost: 10,
  power: 10000,
  traits: ["The Seven Warlords of the Sea", "Donquixote Pirates"],
  attribute: "special",
  effect:
    "[On Play] DON!! −3: Choose one:\n•If your Leader has the {Donquixote Pirates} type, K.O. up to 1 of your opponent's Characters with a cost of 8 or less.\n•Up to 3 of your opponent's Characters with a cost of 7 or less cannot be rested until the end of your opponent's next End Phase.",
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
                  condition: {
                    condition: "leaderTrait",
                    trait: "Donquixote Pirates",
                    match: "includes",
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
                  duration: "untilEndOfOpponentNextEndPhase",
                },
              ],
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op14eb04DonquixoteDoflamingoOp14069069I18n,
};
