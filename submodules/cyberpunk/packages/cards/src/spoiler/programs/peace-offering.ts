import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerPeaceOffering = {
  id: "3b30f02d-84dd-402c-ab4b-87a2ec3badce",
  externalId: "cyberpunk:peace-offering",
  slug: "peace-offering",
  name: "Peace Offering",
  subname: null,
  displayName: "Peace Offering",
  rulesText:
    "You may set a Gig's value to the value of another Gig. Then, if you control a value-pair, draw 1.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Braindance"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "101",
  printings: [
    {
      id: "69a586c6-250a-45aa-a8ae-245076b876ed",
      collectorNumber: "101",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b101.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b101.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Mattia De Iulis",
    },
  ],
  selectedPrintingId: "69a586c6-250a-45aa-a8ae-245076b876ed",
  artist: "Mattia De Iulis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b101.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b101.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "You may set a Gig's value to the value of another Gig. Then, if you control a value-pair, draw 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGigs",
          target: {
            selector: "gig",
            amount: 2,
            selection: {
              mode: "choose",
              min: 2,
              max: 2,
            },
          },
        },
      ],
      effects: [
        {
          effect: "copyGigValue",
          source: {
            selector: "bound",
            id: "selectedGigs",
            index: 0,
          },
          target: {
            selector: "bound",
            id: "selectedGigs",
            index: 1,
          },
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
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
  reminderText: ["Discard programs after they resolve."],
} satisfies SpoilerCardDefinition;
