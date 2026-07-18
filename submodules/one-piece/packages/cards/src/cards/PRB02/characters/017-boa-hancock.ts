import type { CharacterCard } from "@tcg/op-types";
import { prb02BoaHancock017I18n } from "./017-boa-hancock.i18n.ts";

export const prb02BoaHancock017: CharacterCard = {
  id: "PRB02-017",
  canonicalId: "PRB02-017",
  slug: "boa-hancock/prb02-017",
  name: "Boa Hancock",
  printings: [
    {
      id: "PRB02-017",
      artId: "PRB02-017",
      setCode: "PRB02",
      collectorNumber: "017",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-017.jpg",
    },
    {
      id: "PRB02-017_p1",
      artId: "PRB02-017_p1",
      setCode: "PRB02",
      collectorNumber: "017",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-017_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB02",
  cost: 5,
  power: 7000,
  traits: ["FILM", "The Seven Warlords of the Sea", "Kuja Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-017_p1.jpg",
      imageId: "PRB02-017_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card with a [Trigger] from your hand: Your opponent's rested Leader or up to 1 of your opponent's Characters other than [Monkey.D.Luffy] cannot attack until the end of your opponent's next End Phase.[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
            ],
          },
        ],
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "cannotAttack",
                  target: {
                    player: "opponent",
                    zones: ["leader"],
                    count: {
                      amount: 1,
                    },
                    filters: [
                      {
                        filter: "state",
                        value: "rested",
                      },
                    ],
                  },
                  duration: "untilEndOfOpponentNextEndPhase",
                },
              ],
              [
                {
                  action: "cannotAttack",
                  target: {
                    player: "opponent",
                    zones: ["character"],
                    count: {
                      amount: 1,
                      upTo: true,
                    },
                    filters: [
                      {
                        filter: "excludeName",
                        value: "Monkey.D.Luffy",
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
      {
        trigger: "trigger",
        actions: [
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02BoaHancock017I18n,
};
