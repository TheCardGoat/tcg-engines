import type { CharacterCard } from "@tcg/op-types";
import { op17UltiPageOne060I18n } from "./op17-060-ulti-page-one.i18n.ts";

export const op17UltiPageOne060: CharacterCard = {
  id: "OP17-060",
  canonicalId: "OP17-060",
  slug: "ulti-page-one/op17-060",
  name: "Ulti & Page One",
  printings: [
    {
      id: "OP17-060",
      artId: "OP17-060",
      setCode: "OP17",
      collectorNumber: "060",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-060_IaCz1jQ.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP17",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the {Animal Kingdom Pirates} type, add up to 1 DON!! card as active from your DON!! deck. Then, K.O. up to 1 of your opponent's Characters with 3000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Animal Kingdom Pirates",
            match: "includes",
          },
        ],
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
  i18n: op17UltiPageOne060I18n,
};
