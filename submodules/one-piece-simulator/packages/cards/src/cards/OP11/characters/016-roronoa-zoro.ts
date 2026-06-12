import type { CharacterCard } from "@tcg/op-types";
import { op11RoronoaZoro016I18n } from "./016-roronoa-zoro.i18n.ts";

export const op11RoronoaZoro016: CharacterCard = {
  id: "OP11-016",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11RoronoaZoro016I18n,
};
