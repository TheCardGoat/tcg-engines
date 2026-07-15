import type { CharacterCard } from "@tcg/op-types";
import { op05Jinbe066I18n } from "./066-jinbe.i18n.ts";

export const op05Jinbe066: CharacterCard = {
  id: "OP05-066",
  canonicalId: "OP05-066",
  slug: "jinbe/op05-066",
  name: "Jinbe",
  printings: [
    {
      id: "OP05-066",
      artId: "OP05-066",
      setCode: "OP05",
      collectorNumber: "066",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-066.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Fish-Man Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Opponent's Turn] If you have 10 DON!! cards on your field, this Character gains +1000 power.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "eq",
            value: 10,
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
              },
              self: true,
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op05Jinbe066I18n,
};
