import type { CharacterCard } from "@tcg/op-types";
import { op09Bepo074I18n } from "./074-bepo.i18n.ts";

export const op09Bepo074: CharacterCard = {
  id: "OP09-074",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP09",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Heart Pirates Minks"],
  attribute: "strike",
  effect:
    "[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, up to 1 of your Leader or Character cards gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op09Bepo074I18n,
};
