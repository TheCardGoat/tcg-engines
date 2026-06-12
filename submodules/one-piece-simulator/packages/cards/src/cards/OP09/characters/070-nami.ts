import type { CharacterCard } from "@tcg/op-types";
import { op09Nami070I18n } from "./070-nami.i18n.ts";

export const op09Nami070: CharacterCard = {
  id: "OP09-070",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP09",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op09Nami070I18n,
};
