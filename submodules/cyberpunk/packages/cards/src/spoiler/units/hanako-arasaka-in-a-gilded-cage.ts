import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerHanakoArasakaInAGildedCage = {
  id: "315450ca-6472-4bdc-a018-bb0a8f3e0467",
  externalId: "cyberpunk:hanako-arasaka-in-a-gilded-cage",
  slug: "hanako-arasaka-in-a-gilded-cage",
  name: "Hanako Arasaka",
  subname: "In A Gilded Cage",
  displayName: "Hanako Arasaka - In A Gilded Cage",
  rulesText:
    "PLAY Reveal the top 4 cards of your deck. Then choose a friendly Gig. Add all cards with cost equal to that Gig's value to your hand. Trash the rest.",
  flavorText: null,
  color: "yellow",
  classifications: ["Arasaka", "Corpo", "Netrunner"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "126",
  printings: [
    {
      id: "7f5ce7f0-de3e-42e5-91e6-96c05e6c1d23",
      collectorNumber: "126",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b126.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b126.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Akram",
    },
  ],
  selectedPrintingId: "7f5ce7f0-de3e-42e5-91e6-96c05e6c1d23",
  artist: "Akram",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b126.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b126.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 3,
  power: 0,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Reveal the top 4 cards of your deck. Then choose a friendly Gig. Add all cards with cost equal to that Gig's value to your hand. Trash the rest.",
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
            controller: "friendly",
          },
        },
      ],
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 4,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
            costEqualsGigValueOf: {
              selector: "bound",
              id: "selectedGig",
            },
          },
          select: {
            kind: "all",
          },
          reveal: true,
          destination: "hand",
          remainder: {
            zone: "trash",
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
