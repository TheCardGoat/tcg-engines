import type { CharacterCard } from "@tcg/op-types";
import { op13StEthanbaronVNusjuro080I18n } from "./080-st-ethanbaron-v-nusjuro.i18n.ts";

export const op13StEthanbaronVNusjuro080: CharacterCard = {
  id: "OP13-080",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP13",
  cost: 6,
  power: 5000,
  counter: 1000,
  traits: ["Celestial Dragons Five Elders"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-080_p1_Znm7jSk.jpg",
      imageId: "OP13-080_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-080_p2.png",
      imageId: "OP13-080_p2",
    },
  ],
  effect:
    "If you have 7 or more cards in your trash, this Character cannot be removed from the field by your opponent's effects and gains [Rush].\n[When Attacking] If you have 10 or more cards in your trash, give up to 1 of your opponent's Characters 2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op13StEthanbaronVNusjuro080I18n,
};
