import type { CharacterCard } from "@tcg/op-types";
import { st07CharlotteLinlin010I18n } from "./st07-010-charlotte-linlin.i18n.ts";
export const st07CharlotteLinlin010: CharacterCard = {
  id: "ST07-010",
  canonicalId: "ST07-010",
  slug: "charlotte-linlin/st07-010",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "ST07-010",
      artId: "ST07-010",
      setCode: "ST07",
      collectorNumber: "010",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-010.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST07",
  cost: 7,
  traits: ["The Four Emperors", "Big Mom Pirates"],
  power: 8000,
  attribute: "special",
  effect:
    "[On Play] Your opponent chooses one:- Trash 1 card from the top of your opponent's Life cards.- Add 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
  i18n: st07CharlotteLinlin010I18n,
};
