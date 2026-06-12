import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailGildedMatoN = {
  id: "0901652d-99c9-46c7-9821-ca3e8208fb4d",
  externalId: "cb-gilded-mato-n",
  slug: "gilded-mato-n",
  name: "Gilded Matón",
  subname: null,
  displayName: "Gilded Matón",
  rulesText:
    "[PLAY] You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "045",
  printings: [
    {
      id: "846b55b4-5e12-44b6-a204-53bd8c862888",
      collectorNumber: "045",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/045.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/846b55b4-5e12-44b6-a204-53bd8c862888/render-mpvluwwg.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Common",
      finish: "standard",
      artist: "Josan Gonzalez (Deathburger)",
    },
    {
      id: "cbbcb49e-6c6f-436c-91cf-e9716f6a30af",
      collectorNumber: "β045",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b045.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/cbbcb49e-6c6f-436c-91cf-e9716f6a30af/render-mpv4cq2h.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Common",
      finish: "standard",
      artist: "Josan Gonzalez (Deathburger)",
    },
  ],
  selectedPrintingId: "846b55b4-5e12-44b6-a204-53bd8c862888",
  artist: "Josan Gonzalez (Deathburger)",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/045.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/846b55b4-5e12-44b6-a204-53bd8c862888/render-mpvluwwg.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "defeat",
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["gear"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "defeat",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                maxCost: 3,
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
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
