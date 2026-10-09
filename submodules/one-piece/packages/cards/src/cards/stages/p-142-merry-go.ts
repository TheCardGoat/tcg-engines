import type { StageCard } from "@tcg/op-types";
import { pMerryGo142I18n } from "./p-142-merry-go.i18n.ts";
export const pMerryGo142: StageCard = {
  id: "P-142",
  canonicalId: "P-142",
  slug: "merry-go/p-142",
  name: "Merry Go",
  printings: [
    {
      id: "P-142",
      artId: "P-142",
      setCode: "P",
      collectorNumber: "142",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-142.png",
    },
  ],
  cardType: "stage",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 1,
  traits: ["Straw Hat Crew"],
  effect:
    "If your {Straw Hat Crew} type Character with 8000 base power or less would be K.O.'d, you may trash this Stage instead.",
  effects: {
    replacementEffects: [
      {
        replacedEvent: "ko",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
            upTo: true,
          },
          filters: [
            {
              filter: "trait",
              value: "Straw Hat Crew",
              match: "exact",
            },
            {
              filter: "basePower",
              value: 8000,
              comparison: "lte",
            },
          ],
        },
        replacementAction: {
          action: "trashFromField",
          target: {
            player: "self",
            zones: ["stage"],
            count: {
              amount: 1,
            },
            self: true,
          },
        },
      },
    ],
  },
  i18n: pMerryGo142I18n,
};
