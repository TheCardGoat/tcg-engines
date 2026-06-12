import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerGoroTakemuraVengefulBodyguard = {
  id: "105ffd6a-8c13-4a30-bc54-da23045b26d1",
  externalId: "cyberpunk:goro-takemura-vengeful-bodyguard",
  slug: "goro-takemura-vengeful-bodyguard",
  name: "Goro Takemura",
  subname: "Vengeful Bodyguard",
  displayName: "Goro Takemura - Vengeful Bodyguard",
  rulesText:
    "CALL Ready this Legend. When a rival Unit attacks, [Spend Icon]: If you have a sided-pair of Gigs, give a friendly Unit with cost 4 or less +1 power and BLOCKER this turn.",
  flavorText: null,
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "125",
  printings: [
    {
      id: "6635333e-b206-42b5-abd7-2e2f4810eb95",
      collectorNumber: "125",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b125.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b125.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Pandart Studio",
    },
  ],
  selectedPrintingId: "6635333e-b206-42b5-abd7-2e2f4810eb95",
  artist: "Pandart Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b125.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b125.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: [],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "CALL Ready this Legend.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "self",
          },
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a rival Unit attacks, [Spend Icon]: If you have a sided-pair of Gigs, give a friendly Unit with cost 4 or less +1 power and BLOCKER this turn.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "rival",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
          },
        },
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 4,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
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
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: 1,
          duration: "turn",
          conditions: [
            {
              condition: "hasGigPair",
              controller: "friendly",
            },
          ],
        },
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "blocker",
          duration: "turn",
          conditions: [
            {
              condition: "hasGigPair",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
