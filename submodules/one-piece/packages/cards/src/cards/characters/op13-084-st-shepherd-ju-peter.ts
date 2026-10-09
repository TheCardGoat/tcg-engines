import type { CharacterCard } from "@tcg/op-types";
import { op13StShepherdJuPeter084I18n } from "./op13-084-st-shepherd-ju-peter.i18n.ts";

export const op13StShepherdJuPeter084: CharacterCard = {
  id: "OP13-084",
  canonicalId: "OP13-084",
  slug: "st-shepherd-ju-peter",
  name: "St. Shepherd Ju Peter",
  printings: [
    {
      id: "OP13-084",
      artId: "OP13-084",
      setCode: "OP13",
      collectorNumber: "084",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-084_sHvqdwa.jpg",
    },
    {
      id: "OP13-084_p1",
      artId: "OP13-084_p1",
      setCode: "OP13",
      collectorNumber: "084",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-084_p1_oqpeaa5.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP13",
  cost: 7,
  power: 5000,
  counter: 2000,
  traits: ["Celestial Dragons", "Five Elders"],
  attribute: "special",
  effect:
    "If you have 7 or more cards in your trash, this Character cannot be removed from the field by your opponent's effects.\n[Your Turn] If you have 10 or more cards in your trash, set the base power of all of your {Five Elders} type Characters to 7000.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          { condition: "turn", value: "your" },
          { condition: "zoneCount", player: "self", zone: "trash", comparison: "gte", value: 10 },
        ],
        actions: [
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "trait", value: "Five Elders", match: "exact" }],
            },
            value: 7000,
            duration: "permanent",
          },
        ],
      },
      {
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["field"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            bySource: "opponentEffect",
          },
        ],
      },
    ],
  },
  i18n: op13StShepherdJuPeter084I18n,
};
