import type { EventCard } from "@tcg/op-types";
import { st29IaiDeathLionSong017I18n } from "./st29-017-iai-death-lion-song.i18n.ts";
export const st29IaiDeathLionSong017: EventCard = {
  id: "ST29-017",
  canonicalId: "ST29-017",
  slug: "iai-death-lion-song/st29-017",
  name: "Iai Death Lion Song",
  printings: [
    {
      id: "ST29-017",
      artId: "ST29-017",
      setCode: "ST29",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-017.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 2,
  traits: ["Egghead", "Straw Hat Crew"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, if you have 2 or less Life cards, K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  trigger: "Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 4000,
            duration: "thisBattle",
          },
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
                  value: 3,
                },
              ],
            },
            condition: {
              condition: "lifeCount",
              player: "self",
              comparison: "lte",
              value: 2,
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st29IaiDeathLionSong017I18n,
};
