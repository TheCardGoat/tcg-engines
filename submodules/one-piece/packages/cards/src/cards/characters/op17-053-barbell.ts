import type { CharacterCard } from "@tcg/op-types";
import { op17Barbell053I18n } from "./op17-053-barbell.i18n.ts";

export const op17Barbell053: CharacterCard = {
  id: "OP17-053",
  canonicalId: "OP17-053",
  slug: "barbell/op17-053",
  name: "Barbell",
  printings: [
    {
      id: "OP17-053",
      artId: "OP17-053",
      setCode: "OP17",
      collectorNumber: "053",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-053_E1I7iXr.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP17",
  cost: 5,
  power: 7000,
  traits: ["Fish-Man Rocks Pirates"],
  attribute: "strike",
  effect:
    "[On K.O.] Your opponent places 2 cards from their hand at the bottom of their deck in any order.\n\n[Activate: Main] [Once Per Turn] You may trash 1 card from your hand: This Character gains +3000 power during this turn",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: 2,
              },
              chosenBy: "opponent",
            },
            position: "bottom",
            order: "any",
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op17Barbell053I18n,
};
