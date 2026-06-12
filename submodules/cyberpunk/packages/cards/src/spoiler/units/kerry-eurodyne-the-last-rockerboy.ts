import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerKerryEurodyneTheLastRockerboy = {
  id: "52233c7f-5e0a-455d-b96b-b87af97bc473",
  externalId: "cyberpunk:kerry-eurodyne-the-last-rockerboy",
  slug: "kerry-eurodyne-the-last-rockerboy",
  name: "Kerry Eurodyne",
  subname: "The Last Rockerboy",
  displayName: "Kerry Eurodyne - The Last Rockerboy",
  rulesText: "[Spend Icon]: If you have a Gig at max value, draw 2 cards.",
  flavorText: null,
  color: "red",
  classifications: ["Rockerboy", "Samurai"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "067",
  printings: [
    {
      id: "c0e526e4-0cd0-4554-ad3b-8b04d2614a32",
      collectorNumber: "067",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b067.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b067.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Bogna Gawrońska",
    },
  ],
  selectedPrintingId: "c0e526e4-0cd0-4554-ad3b-8b04d2614a32",
  artist: "Bogna Gawrońska",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b067.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b067.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
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
  reminderText: [],
} satisfies SpoilerCardDefinition;
