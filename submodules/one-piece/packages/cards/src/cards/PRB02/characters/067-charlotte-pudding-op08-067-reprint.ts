import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlottePuddingOp08067Reprint067I18n } from "./067-charlotte-pudding-op08-067-reprint.i18n.ts";

export const prb02CharlottePuddingOp08067Reprint067: CharacterCard = {
  id: "OP08-067",
  canonicalId: "OP08-067",
  slug: "charlotte-pudding-op08-067-reprint",
  name: "Charlotte Pudding - OP08-067 (Reprint)",
  printings: [
    {
      id: "OP08-067",
      artId: "OP08-067",
      setCode: "PRB02",
      collectorNumber: "067",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-067_r1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "PRB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    '[Your Turn] [Once Per Turn] When a DON!! card on your field is returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and rest it.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02CharlottePuddingOp08067Reprint067I18n,
};
