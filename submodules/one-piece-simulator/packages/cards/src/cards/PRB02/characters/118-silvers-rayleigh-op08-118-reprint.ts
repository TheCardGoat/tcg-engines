import type { CharacterCard } from "@tcg/op-types";
import { prb02SilversRayleighOp08118Reprint118I18n } from "./118-silvers-rayleigh-op08-118-reprint.i18n.ts";

export const prb02SilversRayleighOp08118Reprint118: CharacterCard = {
  id: "OP08-118",
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 8,
  power: 8000,
  traits: ["Former Roger Pirates"],
  attribute: "slash",
  effect:
    "[On Play] Select up to 2 of your opponent's Characters, and give 1 Character 3000 power and the other 2000 power until the end of your opponent's next turn. Then, K.O. up to 1 of your opponent's Characters with 3000 power or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02SilversRayleighOp08118Reprint118I18n,
};
