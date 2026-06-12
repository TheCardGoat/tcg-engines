import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerAfterpartyAtLizzieS = {
  id: "80681ab5-9420-4967-a9c8-d9fa0f3a0cd9",
  externalId: "cyberpunk:afterparty-at-lizzie-s",
  slug: "afterparty-at-lizzie-s",
  name: "Afterparty at Lizzie's",
  subname: null,
  displayName: "Afterparty at Lizzie's",
  rulesText:
    "Adjust a rival Gig by up to ±2. Then, if a friendly Gig has the same value, draw a card.",
  flavorText: null,
  color: "yellow",
  classifications: ["Braindance", "Mox"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "116",
  printings: [
    {
      id: "cf90586d-659c-4f83-957b-6b9930cd5ca2",
      collectorNumber: "116",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b116.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b116.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Alicja Użarowska",
    },
  ],
  selectedPrintingId: "cf90586d-659c-4f83-957b-6b9930cd5ca2",
  artist: "Alicja Użarowska",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b116.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b116.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Adjust a rival Gig by up to ±2. Then, if a friendly Gig has the same value, draw a card.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            controller: "rival",
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 2,
          direction: "either",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "matchingGig",
              controller: "friendly",
              target: {
                selector: "bound",
                id: "selectedGig",
              },
              property: "value",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies SpoilerCardDefinition;
