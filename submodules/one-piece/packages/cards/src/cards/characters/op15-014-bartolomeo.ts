import type { CharacterCard } from "@tcg/op-types";
import { op15Bartolomeo014I18n } from "./op15-014-bartolomeo.i18n.ts";

export const op15Bartolomeo014: CharacterCard = {
  id: "OP15-014",
  canonicalId: "OP15-014",
  slug: "bartolomeo/op15-014",
  name: "Bartolomeo",
  printings: [
    {
      id: "OP15-014",
      artId: "OP15-014",
      setCode: "OP15",
      collectorNumber: "014",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-014_fA1RUHw.jpg",
    },
    {
      id: "OP15-014_p1",
      artId: "OP15-014",
      setCode: "OP15",
      collectorNumber: "014",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-014_hYyADKn.jpg",
      label: "Bartolomeo (Dash Pack)",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP15",
  cost: 4,
  power: 6000,
  traits: ["Dressrosa Barto Club"],
  attribute: "special",
  effect:
    "If this Character would be K.O.'d, you may trash 1 Event from your hand instead.\n[On Play] Activate up to 1 {Dressrosa} type Event with a base cost of 3 or less from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "activateEvent",
            effectTrigger: "main",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                  match: "includes",
                },
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 3,
                },
                {
                  filter: "cardCategory",
                  value: "event",
                },
              ],
            },
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "ko",
        eventFilter: {
          targetSelf: true,
        },
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
          filters: [
            {
              filter: "cardCategory",
              value: "event",
            },
          ],
        },
      },
    ],
  },
  i18n: op15Bartolomeo014I18n,
};
