import type { EventCard } from "@tcg/op-types";
import { st07SoulPocus015I18n } from "./st07-015-soul-pocus.i18n.ts";
export const st07SoulPocus015: EventCard = {
  id: "ST07-015",
  canonicalId: "ST07-015",
  slug: "soul-pocus/st07-015",
  name: "Soul Pocus",
  printings: [
    {
      id: "ST07-015",
      artId: "ST07-015",
      setCode: "ST07",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-015.png",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 5,
  traits: ["The Four Emperors", "Big Mom Pirates"],
  effect:
    "[Main] Your opponent chooses one:- Trash 1 card from the top of your opponent's Life cards.- Add 1 card from the top of your deck to the top of your Life cards.",
  trigger: "[Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "choice",
            player: "opponent",
            options: [
              [
                {
                  action: "removeFromLife",
                  player: "opponent",
                  count: {
                    amount: 1,
                  },
                  destination: "trash",
                  position: "top",
                },
              ],
              [
                {
                  action: "addToLife",
                  target: {
                    player: "self",
                    zones: ["deck"],
                    count: {
                      amount: 1,
                    },
                  },
                  position: "top",
                },
              ],
            ],
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "choice",
            player: "opponent",
            options: [
              [
                {
                  action: "removeFromLife",
                  player: "opponent",
                  count: {
                    amount: 1,
                  },
                  destination: "trash",
                  position: "top",
                },
              ],
              [
                {
                  action: "addToLife",
                  target: {
                    player: "self",
                    zones: ["deck"],
                    count: {
                      amount: 1,
                    },
                  },
                  position: "top",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: st07SoulPocus015I18n,
};
