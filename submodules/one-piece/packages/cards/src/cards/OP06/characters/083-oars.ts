import type { CharacterCard } from "@tcg/op-types";
import { op06Oars083I18n } from "./083-oars.i18n.ts";

export const op06Oars083: CharacterCard = {
  id: "OP06-083",
  canonicalId: "OP06-083",
  slug: "oars/op06-083",
  name: "Oars",
  printings: [
    {
      id: "OP06-083",
      artId: "OP06-083",
      setCode: "OP06",
      collectorNumber: "083",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-083.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 7000,
  traits: ["Giant Thriller Bark Pirates"],
  attribute: "strike",
  effect:
    "This Character cannot attack.\n[Activate:Main] You may K.O. 1 of your [Thriller Bark Pirates] type Characters: This Character's effect is negated during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "koCharacter",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
                match: "includes",
              },
            ],
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op06Oars083I18n,
};
