import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailKerryEurodyneTheLastRockerboy = defineCyberpunkCard({
  id: "5c4d4058-9185-4305-9e8f-7eca41cf6674",
  slug: "kerry-eurodyne-the-last-rockerboy",
  rulesText: "{Spend} If you control a Gig with 8+ value, draw 2.",
  name: "Kerry Eurodyne — The Last Rockerboy",
  displayName: "Kerry Eurodyne — The Last Rockerboy",
  canonicalId: "kerry-eurodyne-the-last-rockerboy",
  color: "red",
  classifications: ["Rocker", "Samurai"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "012",
  artist: "Bogna Gawrońska",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/012.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    {
      kind: "triggered",
      text: "SPEND If you control a Gig with 8+ value, draw 2.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "targetValue",
              target: {
                selector: "gig",
                controller: "friendly",
                minValue: 8,
              },
              property: "gigValue",
              comparison: "gte",
              value: 8,
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
