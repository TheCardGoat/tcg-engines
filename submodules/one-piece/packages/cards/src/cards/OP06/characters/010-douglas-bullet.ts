import type { CharacterCard } from "@tcg/op-types";
import { op06DouglasBullet010I18n } from "./010-douglas-bullet.i18n.ts";

export const op06DouglasBullet010: CharacterCard = {
  id: "OP06-010",
  canonicalId: "OP06-010",
  slug: "douglas-bullet/op06-010",
  name: "Douglas Bullet",
  printings: [
    {
      id: "OP06-010",
      artId: "OP06-010",
      setCode: "OP06",
      collectorNumber: "010",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-010.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP06",
  cost: 6,
  power: 7000,
  counter: 1000,
  traits: ["FILM", "The Pirates Fest"],
  attribute: "strike",
  effect:
    'If your Leader has the "FILM" type, this Character gains [Blocker].\n(After your opponent declares an attack, you may rest this card to make it the new target of the attack.)',
  effects: {
    permanentEffects: [
      {
        conditions: [{ condition: "leaderTrait", trait: "FILM", match: "includes" }],
        actions: [
          {
            action: "grantKeyword",
            target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
            keyword: "blocker",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op06DouglasBullet010I18n,
};
