import type { CharacterCard } from "@tcg/op-types";
import { op14eb04BoaHancockEb04027027I18n } from "./027-boa-hancock-eb04-027.i18n.ts";

export const op14eb04BoaHancockEb04027027: CharacterCard = {
  id: "EB04-027",
  canonicalId: "EB04-027",
  slug: "boa-hancock-eb04-027",
  name: "Boa Hancock - EB04-027",
  printings: [
    {
      id: "EB04-027",
      artId: "EB04-027",
      setCode: "OP14EB04",
      collectorNumber: "027",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-027_6rHv2Mj.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 5,
  power: 7000,
  trigger: "Play up to 1 Character card with 5000 power or less and a [Trigger] from your hand.",
  traits: ["Kuja Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect: "[On Play] Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op14eb04BoaHancockEb04027027I18n,
};
