import type { CharacterCard } from "@tcg/op-types";
import { op14eb04KikunojoOp14023023I18n } from "./023-kikunojo-op14-023.i18n.ts";

export const op14eb04KikunojoOp14023023: CharacterCard = {
  id: "OP14-023",
  canonicalId: "OP14-023",
  slug: "kikunojo-op14-023",
  name: "Kikunojo - OP14-023",
  printings: [
    {
      id: "OP14-023",
      artId: "OP14-023",
      setCode: "OP14EB04",
      collectorNumber: "023",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-023_Y94eMhK.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect: "[End of Your Turn] Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
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
        ],
      },
    ],
  },
  i18n: op14eb04KikunojoOp14023023I18n,
};
