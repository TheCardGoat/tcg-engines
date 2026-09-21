import type { CharacterCard } from "@tcg/op-types";
import { eb04Doll046I18n } from "./eb04-046-doll.i18n.ts";

export const eb04Doll046: CharacterCard = {
  id: "EB04-046",
  canonicalId: "EB04-046",
  slug: "doll/eb04-046",
  name: "Doll",
  printings: [
    {
      id: "EB04-046",
      artId: "EB04-046",
      setCode: "EB04",
      collectorNumber: "046",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-046_OkJLsc9.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB04",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Navy Egghead"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[Opponent's Turn] All of your {Navy} type Characters gain +2 cost.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "opponent",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Navy",
                  match: "includes",
                },
              ],
            },
            value: 2,
          },
        ],
      },
    ],
  },
  i18n: eb04Doll046I18n,
};
