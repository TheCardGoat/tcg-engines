import type { CharacterCard } from "@tcg/op-types";
import { op17XDrake075I18n } from "./op17-075-x-drake.i18n.ts";

export const op17XDrake075: CharacterCard = {
  id: "OP17-075",
  canonicalId: "OP17-075",
  slug: "x-drake/op17-075",
  name: "X.Drake",
  printings: [
    {
      id: "OP17-075",
      artId: "OP17-075",
      setCode: "OP17",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-075_06daLQe.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Navy Drake Pirates Animal Kingdom Pirates"],
  attribute: "slash",
  effect: "[On Play] DON!! -2: Trash 1 card from your opponent's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "trashFromHand",
            player: "opponent",
            chosenBy: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op17XDrake075I18n,
};
