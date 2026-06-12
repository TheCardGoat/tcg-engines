import type { CharacterCard } from "@tcg/op-types";
import { prb02LaboonReprint048I18n } from "./048-laboon-reprint.i18n.ts";

export const prb02LaboonReprint048: CharacterCard = {
  id: "EB01-048",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal"],
  attribute: "strike",
  effect:
    '[Activate:Main]You may rest this Character: Give up to 1 of your opponent\'s Characters -4 cost during this turn.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
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
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02LaboonReprint048I18n,
};
