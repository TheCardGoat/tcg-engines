import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCyberpsychosis = {
  id: "d0991502-57e5-42e2-b37b-64b425f4f1b5",
  externalId: "cb-cyberpsychosis",
  slug: "cyberpsychosis",
  name: "Cyberpsychosis",
  subname: null,
  displayName: "Cyberpsychosis",
  rulesText:
    "[QUICK] Give an equipped Unit +3 power this turn for each if its equipped Gears. If that Unit steals or fights, defeat it at the end of this turn.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "yellow",
  classifications: ["Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "067",
  printings: [
    {
      id: "5aafe80b-7c7d-4060-8677-a2881a21dd72",
      collectorNumber: "067",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/067.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/5aafe80b-7c7d-4060-8677-a2881a21dd72/render-mpvmhimy.webp",
      set: {
        code: "welcometonightcityretail",
        name: "Welcome to Night City — Retail",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Michal Ivan",
    },
    {
      id: "b3329aae-77de-4c61-b400-114f51bbae5a",
      collectorNumber: "β067",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcitybeta/b067.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/b3329aae-77de-4c61-b400-114f51bbae5a/render-mpvk28qe.webp",
      set: {
        code: "welcometonightcitybeta",
        name: "Welcome to Night City — Beta",
      },
      rarity: "Uncommon",
      finish: "standard",
      artist: "Michal Ivan",
    },
  ],
  selectedPrintingId: "5aafe80b-7c7d-4060-8677-a2881a21dd72",
  artist: "Michal Ivan",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/welcometonightcityretail/067.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/5aafe80b-7c7d-4060-8677-a2881a21dd72/render-mpvmhimy.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["quick"],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    {
      kind: "keyword",
      text: "QUICK",
      keyword: "quick",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "Give an equipped Unit +3 power this turn for each if its equipped Gears. If that Unit steals or fights, defeat it at the end of this turn.",
      trigger: {
        trigger: "play",
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
            hasAttachedCards: true,
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
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: {
            type: "perCount",
            multiplier: 3,
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["gear"],
              attachedTo: {
                selector: "bound",
                id: "selectedUnit",
              },
            },
          },
          duration: "turn",
        },
        {
          effect: "defeatAtEndOfTurnIfAttacks",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies StructuredCardDefinition;
