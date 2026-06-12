import type { ActionCard } from "@tcg/lorcana-types";
import { keepTheAncientWaysI18n } from "./196-keep-the-ancient-ways.i18n";

export const keepTheAncientWays: ActionCard = {
  id: "Fn8",
  canonicalId: "ci_Fn8",
  reprints: ["set11-196"],
  cardType: "action",
  name: "Keep the Ancient Ways",
  inkType: ["steel"],
  franchise: "Pocahontas",
  set: "011",
  cardNumber: 196,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_491b1cb4aadf4bf999230048abf2cf0b",
    tcgPlayer: 673432,
  },
  text: "Opponents can't play actions or items until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      id: "8ke-1",
      type: "action",
      text: "Opponents can't play actions or items until the start of your next turn.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-play-actions",
            target: "OPPONENTS",
            duration: "until-start-of-next-turn",
          },
          {
            type: "restriction",
            restriction: "cant-play-items",
            target: "OPPONENTS",
            duration: "until-start-of-next-turn",
          },
        ],
      },
    },
  ],
  i18n: keepTheAncientWaysI18n,
};
