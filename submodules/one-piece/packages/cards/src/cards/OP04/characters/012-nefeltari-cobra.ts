import type { CharacterCard } from "@tcg/op-types";
import { op04NefeltariCobra012I18n } from "./012-nefeltari-cobra.i18n.ts";

export const op04NefeltariCobra012: CharacterCard = {
  id: "OP04-012",
  canonicalId: "OP04-012",
  slug: "nefeltari-cobra/op04-012",
  name: "Nefeltari Cobra",
  printings: [
    {
      id: "OP04-012",
      artId: "OP04-012",
      setCode: "OP04",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-012.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "[Your Turn] All of your [Alabasta] type Characters other than this Character gain +1000 power.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Alabasta",
                  match: "includes",
                },
                {
                  filter: "excludeSelf",
                },
              ],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op04NefeltariCobra012I18n,
};
