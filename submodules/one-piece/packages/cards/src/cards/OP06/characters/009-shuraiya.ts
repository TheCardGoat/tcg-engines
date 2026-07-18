import type { CharacterCard } from "@tcg/op-types";
import { op06Shuraiya009I18n } from "./009-shuraiya.i18n.ts";

export const op06Shuraiya009: CharacterCard = {
  id: "OP06-009",
  canonicalId: "OP06-009",
  slug: "shuraiya",
  name: "Shuraiya",
  printings: [
    {
      id: "OP06-009",
      artId: "OP06-009",
      setCode: "OP06",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-009.jpg",
    },
    {
      id: "OP06-009_p1",
      artId: "OP06-009_p1",
      setCode: "OP06",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-009_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP06",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["FILM", "Shipbuilding Town"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-009_p1.jpg",
      imageId: "OP06-009_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[When Attacking] / [On Block] [Once Per Turn] This Character's base power becomes the same as your opponent's Leader until the start of your next turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "setBasePowerFrom",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            source: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            duration: "untilStartOfNextTurn",
          },
        ],
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onBlock:this character's base power becomes the same as your opponent's leader until the start of your next turn.",
      },
      {
        trigger: "onBlock",
        actions: [
          {
            action: "setBasePowerFrom",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            source: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            duration: "untilStartOfNextTurn",
          },
        ],
        oncePerTurn: true,
        oncePerTurnKey:
          "shared:whenAttacking|onBlock:this character's base power becomes the same as your opponent's leader until the start of your next turn.",
      },
    ],
  },
  i18n: op06Shuraiya009I18n,
};
