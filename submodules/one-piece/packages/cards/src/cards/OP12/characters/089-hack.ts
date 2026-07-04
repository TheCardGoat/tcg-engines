import type { CharacterCard } from "@tcg/op-types";
import { op12Hack089I18n } from "./089-hack.i18n.ts";

export const op12Hack089: CharacterCard = {
  id: "OP12-089",
  canonicalId: "OP12-089",
  slug: "hack/op12-089",
  name: "Hack",
  printings: [
    {
      id: "OP12-089",
      artId: "OP12-089",
      setCode: "OP12",
      collectorNumber: "089",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-089_iWW5LHg.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Fish-Man Revolutionary Army Dressrosa"],
  attribute: "strike",
  effect:
    'If your Leader has the "Revolutionary Army" type, this Character gains [Blocker] and +4 cost.\n[On K.O.] If your Leader has the "Revolutionary Army" type, K.O. up to 1 of your opponent\'s Characters with a base cost of 4 or less.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12Hack089I18n,
};
