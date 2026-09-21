import type { CharacterCard } from "@tcg/op-types";
import { op17RoronoaZoro095I18n } from "./op17-095-roronoa-zoro.i18n.ts";

export const op17RoronoaZoro095: CharacterCard = {
  id: "OP17-095",
  canonicalId: "OP17-095",
  slug: "roronoa-zoro/op17-095",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP17-095",
      artId: "OP17-095",
      setCode: "OP17",
      collectorNumber: "095",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-095_xEqkpXR.jpg",
      label: "Roronoa Zoro (095)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP17",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Straw Hat Crew Elbaph"],
  attribute: "slash",
  effect:
    "If there is a Character with a cost of 12 or more, this Character gains +3000 power.\nIf one of your Characters would be removed from the field by your opponent's effect, you may place 3 cards from your trash at the bottom of your deck in any order instead.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 12,
              },
            ],
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
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op17RoronoaZoro095I18n,
};
