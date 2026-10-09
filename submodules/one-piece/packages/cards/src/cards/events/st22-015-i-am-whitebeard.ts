import type { EventCard } from "@tcg/op-types";
import { st22IAmWhitebeard015I18n } from "./st22-015-i-am-whitebeard.i18n.ts";
export const st22IAmWhitebeard015: EventCard = {
  id: "ST22-015",
  canonicalId: "ST22-015",
  slug: "i-am-whitebeard/st22-015",
  name: "I Am Whitebeard!!",
  printings: [
    {
      id: "ST22-015",
      artId: "ST22-015",
      setCode: "ST22",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-015.png",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  traits: ["The Four Emperors", "Whitebeard Pirates"],
  cost: 8,
  effect:
    "[Main] If your Leader's type includes \"Whitebeard Pirates\", play up to 1 [Edward.Newgate] from your hand. Then, you may add 1 card from the top or bottom of your Life cards to your hand. If you do, up to 1 of your Leader gains +2000 power until the end of your opponent's next turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Edward.Newgate",
              },
            ],
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "hand",
            position: "choice",
            thenActions: [
              {
                action: "modifyPower",
                target: {
                  player: "self",
                  zones: ["leader"],
                  count: {
                    amount: 1,
                    upTo: true,
                  },
                },
                value: 2000,
                duration: "untilEndOfOpponentNextTurn",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: st22IAmWhitebeard015I18n,
};
