import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerAdamSmasherMetalOverMeat = {
  id: "ad8dee60-9812-4d00-95b6-a79a8dd632f3",
  externalId: "cyberpunk:adam-smasher-metal-over-meat",
  slug: "adam-smasher-metal-over-meat",
  name: "Adam Smasher",
  subname: "Metal Over Meat",
  displayName: "Adam Smasher - Metal Over Meat",
  rulesText: "PLAY Defeat all other Units.",
  flavorText: null,
  color: "yellow",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "137",
  printings: [
    {
      id: "751524e4-9cc0-4598-8775-1dfe0e14624e",
      collectorNumber: "137",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b137.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b137.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Łukasz Poller",
    },
  ],
  selectedPrintingId: "751524e4-9cc0-4598-8775-1dfe0e14624e",
  artist: "Łukasz Poller",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b137.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b137.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 5,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 9,
  power: 15,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat all other Units.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
