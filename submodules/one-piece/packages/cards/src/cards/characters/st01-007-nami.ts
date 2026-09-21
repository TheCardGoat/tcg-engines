import type { CharacterCard } from "@tcg/op-types";
import { strawHat } from "../st01-helpers.ts";
import { st01Nami007I18n } from "./st01-007-nami.i18n.ts";

export const st01Nami007: CharacterCard = {
  id: "ST01-007",
  canonicalId: "ST01-007",
  slug: "nami/st01-007",
  name: "Nami",
  printings: [
    {
      id: "ST01-007",
      artId: "ST01-007",
      setCode: "ST01",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-007.jpg",
    },
    {
      id: "ST01-007_p3",
      artId: "ST01-007_p3",
      setCode: "ST01",
      collectorNumber: "007",
      rarity: "TR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/ST01-007_p3.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: strawHat,
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1 },
            },
            count: { amount: 1, upTo: true },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: st01Nami007I18n,
};
