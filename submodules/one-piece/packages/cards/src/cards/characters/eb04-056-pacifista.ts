import type { CharacterCard } from "@tcg/op-types";
import { eb04Pacifista056I18n } from "./eb04-056-pacifista.i18n.ts";

export const eb04Pacifista056: CharacterCard = {
  id: "EB04-056",
  canonicalId: "EB04-056",
  slug: "pacifista/eb04-056",
  name: "Pacifista",
  printings: [
    {
      id: "EB04-056",
      artId: "EB04-056",
      setCode: "EB04",
      collectorNumber: "056",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-056_pwzR2Ns.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "EB04",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Biological Weapon Navy Egghead"],
  attribute: "special",
  effect:
    "If you have [Jewelry Bonney] and you have 0 Life cards, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "hasCard",
                player: "self",
                zone: "field",
                filters: [
                  {
                    filter: "name",
                    value: "Jewelry Bonney",
                  },
                ],
              },
              {
                condition: "lifeCount",
                player: "self",
                comparison: "eq",
                value: 0,
              },
            ],
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: eb04Pacifista056I18n,
};
