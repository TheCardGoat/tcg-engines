import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailMamanBrigitteSpiritOfDeath = {
  id: "5380dea3-4d21-445b-af02-487b45d40395",
  externalId: "cb-maman-brigitte-spirit-of-death",
  slug: "maman-brigitte-spirit-of-death",
  name: "Maman Brigitte — Spirit of Death",
  subname: null,
  displayName: "Maman Brigitte — Spirit of Death",
  rulesText: "[PLAY] You may discard 2 Programs. If you do, bottom-deck an unequipped rival Unit.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Mystic", "Netrunner", "Voodoo Boys"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "118",
  printings: [
    {
      id: "8a7131eb-e1dd-46d6-84f6-2de315aee975",
      collectorNumber: "118",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/118.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/8a7131eb-e1dd-46d6-84f6-2de315aee975/render-mpvm66w6.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "TOPDOG Entertainment",
    },
    {
      id: "220bef49-2e98-4bc6-b023-5bb8f492b29b",
      collectorNumber: "β118",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b118.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/220bef49-2e98-4bc6-b023-5bb8f492b29b/render-mpv4pquy.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "TOPDOG Entertainment",
    },
  ],
  selectedPrintingId: "8a7131eb-e1dd-46d6-84f6-2de315aee975",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/118.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/8a7131eb-e1dd-46d6-84f6-2de315aee975/render-mpvm66w6.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY You may discard 2 Programs. If you do, bottom-deck an unequipped rival Unit.",
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
            effect: "discardFromHand",
            player: "friendly",
            amount: 2,
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "moveCard",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                hasAttachedCards: false,
                selection: {
                  mode: "choose",
                  min: 1,
                  max: 1,
                },
              },
              destination: "deckBottom",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
