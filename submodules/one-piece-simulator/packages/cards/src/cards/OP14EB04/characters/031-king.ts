import type { CharacterCard } from "@tcg/op-types";
import { op14eb04King031I18n } from "./031-king.i18n.ts";

export const op14eb04King031: CharacterCard = {
  id: "EB04-031",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 6,
  power: 7000,
  traits: ["Animal Kingdom Pirates Lunarian"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-031_p1_KugJhR3.jpg",
      imageId: "EB04-031_p1",
    },
  ],
  effect:
    "If this Character would be K.O.'d, you may return 1 DON!! card from your field to your DON!! deck instead. [Activate: Main] [Once Per Turn] If your Leader has the {Animal Kingdom Pirates} type and you have no other [King] Characters, add up to 1 DON!! card from your DON!! deck and set it as active, and add up to 1 additional DON!! card and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Animal Kingdom Pirates",
              },
              {
                condition: "notHasCard",
                player: "self",
                zone: "character",
                filters: [
                  {
                    filter: "name",
                    value: "King",
                  },
                ],
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04King031I18n,
};
