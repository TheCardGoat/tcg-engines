import type { CharacterCard } from "@tcg/op-types";
import { op11Tashigi007I18n } from "./007-tashigi.i18n.ts";

export const op11Tashigi007: CharacterCard = {
  id: "OP11-007",
  canonicalId: "OP11-007",
  slug: "tashigi/op11-007",
  name: "Tashigi",
  printings: [
    {
      id: "OP11-007",
      artId: "OP11-007",
      setCode: "OP11",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-007.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    '[Activate: Main] You may rest this Character: If your Leader has the "Navy" type, up to 1 of your "Navy" type Characters gains +2000 power during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
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
                  value: "Navy",
                  match: "includes",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
            condition: {
              condition: "leaderTrait",
              trait: "Navy",
              match: "includes",
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11Tashigi007I18n,
};
