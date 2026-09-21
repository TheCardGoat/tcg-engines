import type { CharacterCard } from "@tcg/op-types";
import { op15Nezumi010I18n } from "./op15-010-nezumi.i18n.ts";

export const op15Nezumi010: CharacterCard = {
  id: "OP15-010",
  canonicalId: "OP15-010",
  slug: "nezumi/op15-010",
  name: "Nezumi",
  printings: [
    {
      id: "OP15-010",
      artId: "OP15-010",
      setCode: "OP15",
      collectorNumber: "010",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-010_8LyWLI8.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP15",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Navy East Blue"],
  attribute: "strike",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to its owner's Leader or 1 of their Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
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
      },
    ],
  },
  i18n: op15Nezumi010I18n,
};
