import type { CharacterCard } from "@tcg/op-types";
import { op09RoronoaZoro076I18n } from "./076-roronoa-zoro.i18n.ts";

export const op09RoronoaZoro076: CharacterCard = {
  id: "OP09-076",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP09",
  cost: 3,
  power: 5000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09RoronoaZoro076I18n,
};
