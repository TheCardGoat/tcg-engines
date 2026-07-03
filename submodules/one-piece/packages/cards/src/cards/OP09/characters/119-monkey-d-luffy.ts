import type { CharacterCard } from "@tcg/op-types";
import { op09MonkeyDLuffy119I18n } from "./119-monkey-d-luffy.i18n.ts";

export const op09MonkeyDLuffy119: CharacterCard = {
  id: "OP09-119",
  canonicalId: "OP09-119",
  slug: "monkey-d-luffy/op09-119",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "OP09-119",
      artId: "OP09-119",
      setCode: "OP09",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-119.jpg",
    },
    {
      id: "OP09-119_p2",
      artId: "OP09-119_p2",
      setCode: "OP09",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-119_p2.jpg",
    },
    {
      id: "OP09-119_p1",
      artId: "OP09-119_p1",
      setCode: "OP09",
      collectorNumber: "119",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-119_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP09",
  cost: 9,
  power: 10000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-119_p2.jpg",
      imageId: "OP09-119_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-119_p1.jpg",
      imageId: "OP09-119_p1",
    },
  ],
  effect:
    "[On Play] You may return 1 or more DON!! cards from your field to your DON!! deck: Draw 1 card and this Character gains [Rush] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
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
  i18n: op09MonkeyDLuffy119I18n,
};
