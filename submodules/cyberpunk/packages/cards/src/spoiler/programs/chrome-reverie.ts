import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerChromeReverie = {
  id: "a5e0cd15-861f-46ac-b6e9-db5e30acfc82",
  externalId: "cyberpunk:chrome-reverie",
  slug: "chrome-reverie",
  name: "Chrome Reverie",
  subname: null,
  displayName: "Chrome Reverie",
  rulesText:
    "A rival Unit can't attack until your next turn. If you control a min Gig, you may Call a Legend for free. (You can only Call a Legend once per turn.)",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Braindance"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "131",
  printings: [
    {
      id: "e9f6b84e-15c9-432a-92a8-56537b305410",
      collectorNumber: "131",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b131a.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b131a.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "standard",
      artist: "ADIA",
    },
  ],
  selectedPrintingId: "e9f6b84e-15c9-432a-92a8-56537b305410",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b131a.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b131a.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "A rival Unit can't attack until your next turn. If you control a min Gig, you may Call a Legend for free.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          rule: "cantAttack",
          duration: "untilSourceNextTurn",
          optional: true,
        },
        {
          effect: "callLegend",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["legendArea"],
            cardTypes: ["legend"],
            face: "faceDown",
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          free: true,
          optional: true,
          conditions: [
            {
              condition: "hasMinGig",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [
    "You can only Call a Legend once per turn.",
    "Discard programs after they resolve.",
  ],
} satisfies SpoilerCardDefinition;
