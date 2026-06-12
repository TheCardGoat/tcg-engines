import type { CharacterCard } from "@tcg/op-types";
import { op13SmokerOp10030Sp030I18n } from "./030-smoker-op10-030-sp.i18n.ts";

export const op13SmokerOp10030Sp030: CharacterCard = {
  id: "OP10-030",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP13",
  cost: 5,
  power: 7000,
  traits: ["Navy Punk Hazard"],
  attribute: "slash",
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.)[Activate: Main] Set up to 1 of your DON!! cards as active. Then, you cannot set DON!! cards as active using Character effects during this turn.",
  effects: {
    keywords: ["banish"],
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13SmokerOp10030Sp030I18n,
};
