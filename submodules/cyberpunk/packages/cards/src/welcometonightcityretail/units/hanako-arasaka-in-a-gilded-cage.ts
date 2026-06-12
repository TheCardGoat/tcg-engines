import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailHanakoArasakaInAGildedCage = {
  id: "2902da45-ec28-4971-a731-ea1eda4c6ba1",
  externalId: "cb-hanako-arasaka-in-a-gilded-cage",
  slug: "hanako-arasaka-in-a-gilded-cage",
  name: "Hanako Arasaka — In a Gilded Cage",
  subname: null,
  displayName: "Hanako Arasaka — In a Gilded Cage",
  rulesText:
    "[PLAY] Search the top 4 cards of your deck. Reveal any number of cards with cost equal to any friendly Gig values and add them to your hand. Bottom-deck the rest.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Arasaka", "Corpo", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "046",
  printings: [
    {
      id: "7386d22f-1065-4043-a6c4-9cee6256fe8a",
      collectorNumber: "046",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/046.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/7386d22f-1065-4043-a6c4-9cee6256fe8a/render-mpvm7wvo.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
    {
      id: "ab6fab2a-8101-4bc7-8f5d-b55adf09bc4c",
      collectorNumber: "β046",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b046.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/ab6fab2a-8101-4bc7-8f5d-b55adf09bc4c/render-mpv4rqut.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Rare",
      finish: "standard",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "7386d22f-1065-4043-a6c4-9cee6256fe8a",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/046.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/7386d22f-1065-4043-a6c4-9cee6256fe8a/render-mpvm7wvo.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 1,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Search the top 4 cards of your deck. Reveal any number of cards with cost equal to any friendly Gig values and add them to your hand. Bottom-deck the rest.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
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
              selector: "gig",
              controller: "friendly",
              amount: "all",
            },
          },
          select: {
            kind: "all",
          },
          reveal: true,
          destination: "hand",
          remainder: {
            zone: "deckBottom",
          },
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
