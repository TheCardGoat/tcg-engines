import type { CharacterCard } from "@tcg/op-types";
import { op16RoronoaZoro035I18n } from "./op16-035-roronoa-zoro.i18n.ts";

export const op16RoronoaZoro035: CharacterCard = {
  id: "OP16-035",
  canonicalId: "OP16-035",
  slug: "roronoa-zoro/op16-035",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP16-035",
      artId: "OP16-035",
      setCode: "OP16",
      collectorNumber: "035",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-035_cKIOLrf.jpg",
      label: "Roronoa Zoro (035)",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP16",
  cost: 7,
  power: 9000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[On Play] Rest up to 1 of your opponent's cards. Then, you may trash 1 card from your hand. If you do, give up to 3 rested DON!! cards to your Leader.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
        ],
      },
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 3,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op16RoronoaZoro035I18n,
};
