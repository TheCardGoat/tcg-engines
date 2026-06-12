import type { CharacterCard } from "@tcg/op-types";
import { op04Orlumbus079I18n } from "./079-orlumbus.i18n.ts";

export const op04Orlumbus079: CharacterCard = {
  id: "OP04-079",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Dressrosa Yonta Maria Fleet"],
  attribute: "strike",
  effect:
    "[Activate:Main] [Once Per Turn] Give up to 1 of your opponent's Characters -4 cost during this turn and trash 2 cards from the top of your deck. Then, K.O. 1 of your [Dressrosa] type Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -4,
            duration: "thisTurn",
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 2,
          },
          {
            action: "ko",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04Orlumbus079I18n,
};
