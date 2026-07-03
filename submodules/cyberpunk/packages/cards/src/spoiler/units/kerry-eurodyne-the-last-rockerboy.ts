import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerKerryEurodyneTheLastRockerboy = defineCyberpunkCard({
  id: "52233c7f-5e0a-455d-b96b-b87af97bc473",
  slug: "kerry-eurodyne-the-last-rockerboy",
  rulesText: "[Spend Icon]: If you have a Gig at max value, draw 2 cards.",
  subname: "The Last Rockerboy",
  name: "Kerry Eurodyne",
  displayName: "Kerry Eurodyne - The Last Rockerboy",
  canonicalId: "kerry-eurodyne-the-last-rockerboy",
  color: "red",
  classifications: ["Rockerboy", "Samurai"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "067",
  artist: "Bogna Gawrońska",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/067.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "unit",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "[Spend Icon]: If you have a Gig at max value, draw 2 cards.",
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
              condition: "hasGigAtMaxValue",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
