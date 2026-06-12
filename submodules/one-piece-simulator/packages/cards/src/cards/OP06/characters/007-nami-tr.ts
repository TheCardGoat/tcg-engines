import type { CharacterCard } from "@tcg/op-types";
import { op06NamiTr007I18n } from "./007-nami-tr.i18n.ts";

export const op06NamiTr007: CharacterCard = {
  id: "ST01-007",
  cardType: "character",
  color: ["red"],
  rarity: "TR",
  setId: "OP06",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[Activate:Main][Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
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
  i18n: op06NamiTr007I18n,
};
