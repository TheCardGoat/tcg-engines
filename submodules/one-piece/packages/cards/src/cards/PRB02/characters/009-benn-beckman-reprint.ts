import type { CharacterCard } from "@tcg/op-types";
import { prb02BennBeckmanReprint009I18n } from "./009-benn-beckman-reprint.i18n.ts";

export const prb02BennBeckmanReprint009: CharacterCard = {
  id: "OP09-009",
  canonicalId: "OP09-009",
  slug: "benn-beckman-reprint",
  name: "Benn.Beckman (Reprint)",
  printings: [
    {
      id: "OP09-009",
      artId: "OP09-009",
      setCode: "PRB02",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-009_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB02",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  effect:
    '[On Play] Trash up to 1 of your opponent\'s Characters with 6000 power or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromField",
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
                  value: 6000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02BennBeckmanReprint009I18n,
};
