import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerCarnageAtTheColosseum = {
  id: "bd0ecde8-2aec-44cb-a11a-fb81bc34827a",
  externalId: "cyberpunk:carnage-at-the-colosseum",
  slug: "carnage-at-the-colosseum",
  name: "Carnage At The Colosseum",
  subname: null,
  displayName: "Carnage At The Colosseum",
  rulesText:
    "Play this Program for -1 €$ for each friendly Gig with 8+ value, to a minimum of 1 €$. Defeat a rival Unit with less power than a friendly Unit.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "red",
  classifications: ["Braindance", "Extreme"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "030",
  printings: [
    {
      id: "c63be6e4-f51d-42b5-beed-d9842d349a0f",
      collectorNumber: "030",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b030.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b030.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Matías Bergara",
    },
  ],
  selectedPrintingId: "c63be6e4-f51d-42b5-beed-d9842d349a0f",
  artist: "Matías Bergara",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b030.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b030.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 6,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Defeat a rival Unit with less power than a friendly Unit.",
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
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            powerLessThanAnyOf: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
            },
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: {
      selector: "gig",
      controller: "friendly",
      amount: "all",
      minValue: 8,
    },
    min: 1,
  },
} satisfies SpoilerCardDefinition;
