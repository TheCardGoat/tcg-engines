import type { CharacterCard } from "@tcg/op-types";
import { op11JaguarDSaul075I18n } from "./075-jaguar-d-saul.i18n.ts";

export const op11JaguarDSaul075: CharacterCard = {
  id: "OP11-075",
  canonicalId: "OP11-075",
  slug: "jaguar-d-saul/op11-075",
  name: "Jaguar.D.Saul",
  printings: [
    {
      id: "OP11-075",
      artId: "OP11-075",
      setCode: "OP11",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-075.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP11",
  cost: 6,
  power: 6000,
  trigger: "Activate this card's [On Play] effect.",
  traits: ["Giant Former Navy Ohara"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader is [Nico Robin] and you have 7 or more DON!! cards on your field, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderName",
                name: "Nico Robin",
              },
              {
                condition: "donFieldCount",
                player: "self",
                comparison: "gte",
                value: 7,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "onPlay",
          },
        ],
      },
    ],
  },
  i18n: op11JaguarDSaul075I18n,
};
