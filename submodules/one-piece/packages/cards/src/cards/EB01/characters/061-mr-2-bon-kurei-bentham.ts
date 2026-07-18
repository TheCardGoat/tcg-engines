import type { CharacterCard } from "@tcg/op-types";
import { eb01Mr2BonKureiBentham061I18n } from "./061-mr-2-bon-kurei-bentham.i18n.ts";

export const eb01Mr2BonKureiBentham061: CharacterCard = {
  id: "EB01-061",
  canonicalId: "EB01-061",
  slug: "mr-2-bon-kurei-bentham/eb01-061",
  name: "Mr.2.Bon.Kurei (Bentham)",
  printings: [
    {
      id: "EB01-061",
      artId: "EB01-061",
      setCode: "EB01",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-061.jpg",
    },
    {
      id: "EB01-061_p1",
      artId: "EB01-061_p1",
      setCode: "EB01",
      collectorNumber: "061",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-061_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "EB01",
  cost: 4,
  power: 1000,
  counter: 1000,
  traits: ["Former Baroque Works"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-061_p1.jpg",
      imageId: "EB01-061_p1",
    },
  ],
  effect:
    "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.[When Attacking] Select up to 1 of your opponent's Characters. This Character's base power becomes the same as the selected Character's power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "copyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb01Mr2BonKureiBentham061I18n,
};
