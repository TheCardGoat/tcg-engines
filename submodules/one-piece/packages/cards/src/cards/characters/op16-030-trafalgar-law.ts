import type { CharacterCard } from "@tcg/op-types";
import { op16TrafalgarLaw030I18n } from "./op16-030-trafalgar-law.i18n.ts";

export const op16TrafalgarLaw030: CharacterCard = {
  id: "OP16-030",
  canonicalId: "OP16-030",
  slug: "trafalgar-law/op16-030",
  name: "Trafalgar Law",
  printings: [
    {
      id: "OP16-030",
      artId: "OP16-030",
      setCode: "OP16",
      collectorNumber: "030",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-030_mRoxqQ7.jpg",
      label: "Trafalgar Law (030)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP16",
  cost: 8,
  power: 9000,
  traits: ["Heart Pirates Supernovas"],
  attribute: "slash",
  effect:
    "[On Play] Up to 1 of your opponent's rested Characters will not become active in your opponent's next Refresh Phase.\n\n[End of Your Turn] Set all of your green Characters with a cost of 5 or less as active.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "endOfYourTurn",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "color",
                  value: "green",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op16TrafalgarLaw030I18n,
};
