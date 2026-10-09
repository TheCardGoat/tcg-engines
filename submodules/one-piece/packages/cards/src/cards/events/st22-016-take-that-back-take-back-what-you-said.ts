import type { EventCard } from "@tcg/op-types";
import { st22TakeThatBackTakeBackWhatYouSaid016I18n } from "./st22-016-take-that-back-take-back-what-you-said.i18n.ts";
export const st22TakeThatBackTakeBackWhatYouSaid016: EventCard = {
  id: "ST22-016",
  canonicalId: "ST22-016",
  slug: "take-that-back-take-back-what-you-said/st22-016",
  name: "Take That Back!! Take Back What You Said!!",
  printings: [
    {
      id: "ST22-016",
      artId: "ST22-016",
      setCode: "ST22",
      collectorNumber: "016",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-016.png",
    },
  ],
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  cost: 1,
  traits: ["Whitebeard Pirates"],
  effect:
    '[Counter] Reveal 1 card from the top of your deck. If that card\'s type includes "Whitebeard Pirates", up to 1 of your Leader or Character cards gains +4000 power during this battle.',
  trigger: "Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "revealFromDeck",
            player: "self",
            count: 1,
            ifRevealedCardMatches: {
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
                },
              ],
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
              ],
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
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st22TakeThatBackTakeBackWhatYouSaid016I18n,
};
