import type { StageCard } from "@tcg/op-types";
import { op06TheArkNoah041I18n } from "./041-the-ark-noah.i18n.ts";

export const op06TheArkNoah041: StageCard = {
  id: "OP06-041",
  canonicalId: "OP06-041",
  slug: "the-ark-noah",
  name: "The Ark Noah",
  printings: [
    {
      id: "OP06-041",
      artId: "OP06-041",
      setCode: "OP06",
      collectorNumber: "041",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-041.jpg",
    },
  ],
  cardType: "stage",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 6,
  trigger: "Play this card.",
  traits: ["Fish-Man Island"],
  effect: "[On Play] Rest all of your opponent's Characters.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op06TheArkNoah041I18n,
};
