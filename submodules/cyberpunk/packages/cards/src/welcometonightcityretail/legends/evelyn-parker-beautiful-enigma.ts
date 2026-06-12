import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailEvelynParkerBeautifulEnigma = {
  id: "55807eb7-8a8e-44a9-97a2-c8ac993e7b43",
  externalId: "cb-evelyn-parker-beautiful-enigma",
  slug: "evelyn-parker-beautiful-enigma",
  name: "Evelyn Parker — Beautiful Enigma",
  subname: null,
  displayName: "Evelyn Parker — Beautiful Enigma",
  rulesText:
    "When a friendly CORPO or GANGER Unit steals 1 or more Gigs, ready 1 Eddie.\n1 €$, [Spend Icon:] A rival Unit must attack next turn if it can.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "107",
  printings: [
    {
      id: "ba766c1d-d929-4a22-bc91-7400784536c8",
      collectorNumber: "107",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/107.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/ba766c1d-d929-4a22-bc91-7400784536c8/render-mpvmo7cq.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
    {
      id: "080b22ac-9c3d-48ee-ad4f-4e9579f22adc",
      collectorNumber: "β107",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b107.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/080b22ac-9c3d-48ee-ad4f-4e9579f22adc/render-mpu66269.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "ba766c1d-d929-4a22-bc91-7400784536c8",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/107.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/ba766c1d-d929-4a22-bc91-7400784536c8/render-mpvmo7cq.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "When a friendly CORPO or GANGER Unit steals 1 or more Gigs, ready 1 Eddie.",
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
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "readyEddies",
          player: "friendly",
          amount: 1,
        },
      ],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND A rival Unit must attack next turn if it can.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
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
          cost: "payEddies",
          amount: 1,
        },
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "mustAttack",
          duration: "untilSourceNextTurn",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
