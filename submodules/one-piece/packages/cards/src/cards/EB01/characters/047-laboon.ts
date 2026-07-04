import type { CharacterCard } from "@tcg/op-types";
import { eb01Laboon047I18n } from "./047-laboon.i18n.ts";

export const eb01Laboon047: CharacterCard = {
  id: "EB01-047",
  canonicalId: "EB01-047",
  slug: "laboon/eb01-047",
  name: "Laboon",
  printings: [
    {
      id: "EB01-047",
      artId: "EB01-047",
      setCode: "EB01",
      collectorNumber: "047",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-047.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  power: 4000,
  traits: ["Animal"],
  attribute: "strike",
  effect:
    "[Once Per Turn] When a Character is K.O.'d, draw 1 card and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenCharacterKod",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb01Laboon047I18n,
};
