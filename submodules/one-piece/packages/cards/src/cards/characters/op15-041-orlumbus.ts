import type { CharacterCard } from "@tcg/op-types";
import { op15Orlumbus041I18n } from "./op15-041-orlumbus.i18n.ts";

export const op15Orlumbus041: CharacterCard = {
  id: "OP15-041",
  canonicalId: "OP15-041",
  slug: "orlumbus/op15-041",
  name: "Orlumbus",
  printings: [
    {
      id: "OP15-041",
      artId: "OP15-041",
      setCode: "OP15",
      collectorNumber: "041",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-041_bKQUxHm.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP15",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Dressrosa Yonta Maria Fleet"],
  attribute: "strike",
  effect:
    "[On K.O.] Draw 1 card.\n[Activate: Main] [Once Per Turn] You may place 1 of your Characters at the bottom of the owner's deck: This Character gains [Rush] during this turn.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "returnCharacterToDeck",
            amount: 1,
            position: "bottom",
            player: "self",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op15Orlumbus041I18n,
};
