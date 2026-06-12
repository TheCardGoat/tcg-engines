import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailWraithMarauders = {
  id: "67b47cff-2237-4765-86fb-9b2b3abecbb1",
  externalId: "cb-wraith-marauders",
  slug: "wraith-marauders",
  name: "Wraith Marauders",
  subname: null,
  displayName: "Wraith Marauders",
  rulesText:
    "When this Unit steals a Gig, ready another friendly Unit with power equal to the Gig's value.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Ganger", "Nomad", "Raffen Shiv"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "092",
  printings: [
    {
      id: "0944037e-5b14-4332-b345-7935924c2125",
      collectorNumber: "092",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/092.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/0944037e-5b14-4332-b345-7935924c2125/render-mpvm4vc3.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
    {
      id: "89c5ec5e-dcc1-4ce4-970d-28b0226272b1",
      collectorNumber: "β092",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b092.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/89c5ec5e-dcc1-4ce4-970d-28b0226272b1/render-mpv4ofxy.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "0944037e-5b14-4332-b345-7935924c2125",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/092.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/0944037e-5b14-4332-b345-7935924c2125/render-mpvm4vc3.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit steals a Gig, ready another friendly Unit with power equal to the Gig's value.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          source: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ready",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
            powerEqualsGigValueOf: {
              selector: "context",
              key: "triggeredGigs",
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
  reminderText: [],
} satisfies StructuredCardDefinition;
