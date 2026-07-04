import type { CharacterCard } from "@tcg/op-types";
import { op13Franky033I18n } from "./033-franky.i18n.ts";

export const op13Franky033: CharacterCard = {
  id: "OP13-033",
  canonicalId: "OP13-033",
  slug: "franky/op13-033",
  name: "Franky",
  printings: [
    {
      id: "OP13-033",
      artId: "OP13-033",
      setCode: "OP13",
      collectorNumber: "033",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-033_HVso4X8.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP13",
  cost: 3,
  power: 5000,
  traits: ["FILM Straw Hat Crew"],
  attribute: "strike",
  effect: "[On K.O.] Rest up to 2 of your opponent's cards.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op13Franky033I18n,
};
