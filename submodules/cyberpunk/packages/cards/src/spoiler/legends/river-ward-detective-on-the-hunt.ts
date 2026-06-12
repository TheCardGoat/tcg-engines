import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerRiverWardDetectiveOnTheHunt = {
  id: "53886d23-5ec8-4d75-824f-9b02921e87dc",
  externalId: "cyberpunk:river-ward-detective-on-the-hunt",
  slug: "river-ward-detective-on-the-hunt",
  name: "River Ward",
  subname: "Detective on the Hunt",
  displayName: "River Ward - Detective on the Hunt",
  rulesText:
    "CALL Draw a card. When a Unit attacks, [Spend Icon]: Choose a Gear from your hand with cost 2 or less. Equip it for free to a friendly Yellow Unit with no equipped Gears.",
  flavorText: null,
  color: "yellow",
  classifications: ["NCPD"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "135",
  printings: [
    {
      id: "cd02a445-e212-4937-b904-cecbf29f792f",
      collectorNumber: "135",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b135.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b135.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Pandart Studio",
    },
  ],
  selectedPrintingId: "cd02a445-e212-4937-b904-cecbf29f792f",
  artist: "Pandart Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b135.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b135.webp",
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
      text: "CALL Draw a card.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a Unit attacks, [Spend Icon]: Choose a Gear from your hand with cost 2 or less. Equip it for free to a friendly Yellow Unit with no equipped Gears.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "any",
          target: {
            selector: "card",
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
            colors: ["yellow"],
            hasAttachedCards: false,
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
          effect: "attachCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["hand"],
            cardTypes: ["gear"],
            maxCost: 2,
          },
          attachTo: {
            selector: "bound",
            id: "selectedUnit",
          },
          free: true,
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
