import type { CharacterCard } from "@tcg/op-types";
import { op05NefeltariVivi086I18n } from "./086-nefeltari-vivi.i18n.ts";

export const op05NefeltariVivi086: CharacterCard = {
  id: "OP05-086",
  canonicalId: "OP05-086",
  slug: "nefeltari-vivi/op05-086",
  name: "Nefeltari Vivi",
  printings: [
    {
      id: "OP05-086",
      artId: "OP05-086",
      setCode: "OP05",
      collectorNumber: "086",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-086.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "If you have 10 or more cards in your trash, this Character gains [Blocker]. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 10,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1 },
              self: true,
            },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op05NefeltariVivi086I18n,
};
