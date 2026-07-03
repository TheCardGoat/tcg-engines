import type { CharacterCard } from "@tcg/op-types";
import { eb02MonkeyDLuffy061I18n } from "./061-monkey-d-luffy.i18n.ts";

export const eb02MonkeyDLuffy061: CharacterCard = {
  id: "EB02-061",
  canonicalId: "EB02-061",
  slug: "monkey-d-luffy/eb02-061",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "EB02-061",
      artId: "EB02-061",
      setCode: "EB02",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-061.jpg",
    },
    {
      id: "EB02-061_p2",
      artId: "EB02-061_p2",
      setCode: "EB02",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-061_p2.png",
    },
    {
      id: "EB02-061_p1",
      artId: "EB02-061_p1",
      setCode: "EB02",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-061_p1.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "EB02",
  cost: 6,
  power: 7000,
  traits: ["Straw Hat Crew Water Seven"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-061_p2.png",
      imageId: "EB02-061_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-061_p1.png",
      imageId: "EB02-061_p1",
    },
  ],
  effect:
    "If your Leader is multicolored and your opponent has 5 or more DON!! cards on their field, this Character gains [Rush].\n[When Attacking] [Once Per Turn] You may return 2 of your active DON!! cards to your DON!! deck: Set this Character as active. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02MonkeyDLuffy061I18n,
};
