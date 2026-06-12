import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerSandayuOdaHanakoSGuardian = {
  id: "f8c82c1c-8ef2-4924-b5ba-5bb7f333aae7",
  externalId: "cyberpunk:sandayu-oda-hanako-s-guardian",
  slug: "sandayu-oda-hanako-s-guardian",
  name: "Sandayu Oda",
  subname: "Hanako's Guardian",
  displayName: "Sandayu Oda - Hanako's Guardian",
  rulesText:
    "PLAY Spend a rival Unit for each friendly value-pair of Gigs. This Unit can attack rival Units the turn it's played.",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "088",
  printings: [
    {
      id: "06596a74-abef-4532-8920-2f1631441636",
      collectorNumber: "088",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b088.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b088.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "ADIA",
    },
  ],
  selectedPrintingId: "06596a74-abef-4532-8920-2f1631441636",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b088.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b088.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 7,
  power: 8,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Spend a rival Unit for each friendly value-pair of Gigs.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "forEachFriendlyGigPair",
          effects: [
            {
              effect: "spend",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "ready",
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
    {
      kind: "static",
      text: "This Unit can attack rival Units the turn it's played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "continuous",
          conditions: [
            {
              condition: "playedThisTurn",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
