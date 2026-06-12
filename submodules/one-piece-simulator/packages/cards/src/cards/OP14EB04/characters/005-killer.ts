import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Killer005I18n } from "./005-killer.i18n.ts";

export const op14eb04Killer005: CharacterCard = {
  id: "OP14-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Kid Pirates Supernovas"],
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
  i18n: op14eb04Killer005I18n,
};
