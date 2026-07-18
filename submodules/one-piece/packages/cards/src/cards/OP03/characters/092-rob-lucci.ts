import type { CharacterCard } from "@tcg/op-types";
import { op03RobLucci092I18n } from "./092-rob-lucci.i18n.ts";

export const op03RobLucci092: CharacterCard = {
  id: "OP03-092",
  canonicalId: "OP03-092",
  slug: "rob-lucci/op03-092",
  name: "Rob Lucci",
  printings: [
    {
      id: "OP03-092",
      artId: "OP03-092",
      setCode: "OP03",
      collectorNumber: "092",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-092.jpg",
    },
    {
      id: "OP03-092_p1",
      artId: "OP03-092_p1",
      setCode: "OP03",
      collectorNumber: "092",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-092_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "OP03",
  cost: 6,
  power: 7000,
  traits: ["CP9"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-092_p1.jpg",
      imageId: "OP03-092_p1",
    },
  ],
  effect:
    '[On Play] You may place 2 cards with a type including "CP" from your trash at the bottom of your deck in any order: This Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnTrashToDeck",
            amount: 2,
            position: "bottom",
            filters: [
              {
                filter: "trait",
                value: "CP",
                match: "includes",
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
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op03RobLucci092I18n,
};
