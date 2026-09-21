import type { CharacterCard } from "@tcg/op-types";
import { printing, strawHat } from "../st01-helpers.ts";
import { st01Sanji004I18n } from "./st01-004-sanji.i18n.ts";

export const st01Sanji004: CharacterCard = {
  id: "ST01-004",
  canonicalId: "ST01-004",
  slug: "sanji/st01-004",
  name: "Sanji",
  printings: [printing("ST01-004", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 4000,
  traits: strawHat,
  attribute: "strike",
  effect: "[DON!! x2] This Character gains [Rush].",
  effects: {
    permanentEffects: [
      {
        conditions: [{ condition: "donAttached", amount: 2 }],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st01Sanji004I18n,
};
