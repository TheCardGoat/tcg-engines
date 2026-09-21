import type { CharacterCard } from "@tcg/op-types";
import { op16CatarinaDevon104I18n } from "./op16-104-catarina-devon.i18n.ts";

export const op16CatarinaDevon104: CharacterCard = {
  id: "OP16-104",
  canonicalId: "OP16-104",
  slug: "catarina-devon/op16-104",
  name: "Catarina Devon",
  printings: [
    {
      id: "OP16-104",
      artId: "OP16-104",
      setCode: "OP16",
      collectorNumber: "104",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-104_c2RAjOp.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP16",
  cost: 4,
  power: 3000,
  counter: 2000,
  trigger:
    "Draw 1 card and play up to 1 {Blackbeard Pirates} type Character with a cost of 1 from your trash.",
  traits: ["Blackbeard Pirates Impel Down"],
  attribute: "special",
  effect:
    "[When Attacking] Select up to 1 of your opponent's Characters. This Character's base power becomes the same as the selected Character's power during this turn.",
  effects: {
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
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              chosenBy: "self",
            },
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op16CatarinaDevon104I18n,
};
