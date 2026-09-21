import type { CharacterCard } from "@tcg/op-types";
import { op16Mr3037I18n } from "./op16-037-mr-3.i18n.ts";

export const op16Mr3037: CharacterCard = {
  id: "OP16-037",
  canonicalId: "OP16-037",
  slug: "mr-3/op16-037",
  name: "Mr.3",
  printings: [
    {
      id: "OP16-037",
      artId: "OP16-037",
      setCode: "OP16",
      collectorNumber: "037",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-037_7SCbkuN.jpg",
      label: "Mr.3(Galdino) (037)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP16",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Impel Down Former Baroque Works"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the {Impel Down} type, rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Impel Down",
            match: "includes",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
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
  i18n: op16Mr3037I18n,
};
