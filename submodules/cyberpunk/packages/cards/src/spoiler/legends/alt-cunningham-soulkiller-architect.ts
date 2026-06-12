import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerAltCunninghamSoulkillerArchitect = {
  id: "5bbc73e5-14c8-4817-8ffc-865dc0c6d068",
  externalId: "cyberpunk:alt-cunningham-soulkiller-architect",
  slug: "alt-cunningham-soulkiller-architect",
  name: "Alt Cunningham",
  subname: "Soulkiller Architect",
  displayName: "Alt Cunningham - Soulkiller Architect",
  rulesText:
    "GO SOLO When this Legend steals a Gig, you may remove this Legend from the game. If you do, choose a Program from your trash. Play it for free.",
  flavorText: null,
  color: "blue",
  classifications: ["Merc", "Netrunner"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "121",
  printings: [
    {
      id: "ba44e0d0-80ee-4ee1-8828-57cdb90aaa5f",
      collectorNumber: "121",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b121.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b121.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Pandart Studio",
    },
  ],
  selectedPrintingId: "ba44e0d0-80ee-4ee1-8828-57cdb90aaa5f",
  artist: "Pandart Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b121.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b121.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["goSolo"],
  type: "legend",
  cost: 6,
  power: 4,
  abilities: [
    {
      kind: "keyword",
      text: "GO SOLO",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "When this Legend steals a Gig, you may remove this Legend from the game. If you do, choose a Program from your trash. Play it for free.",
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
          effect: "ifYouDo",
          doEffect: {
            effect: "removeFromGame",
            target: {
              selector: "self",
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "playCard",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["trash"],
                cardTypes: ["program"],
              },
              free: true,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
