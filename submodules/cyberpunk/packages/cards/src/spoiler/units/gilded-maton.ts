import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerGildedMaton = {
  id: "0901652d-99c9-46c7-9821-ca3e8208fb4d",
  externalId: "cyberpunk:gilded-maton",
  slug: "gilded-maton",
  name: "Gilded Matón",
  subname: null,
  displayName: "Gilded Matón",
  rulesText:
    "PLAY You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "045",
  printings: [
    {
      id: "0360da55-2315-456a-8155-cd25f6ee9ea7",
      collectorNumber: "045",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b045.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b045.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Josan Gonzalez (Deathburger)",
    },
  ],
  selectedPrintingId: "0360da55-2315-456a-8155-cd25f6ee9ea7",
  artist: "Josan Gonzalez (Deathburger)",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b045.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b045.webp",
  rarity: null,
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
              zones: ["field"],
              cardTypes: ["gear"],
              attachedTo: {
                selector: "card",
                controller: "friendly",
              },
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
} satisfies SpoilerCardDefinition;
