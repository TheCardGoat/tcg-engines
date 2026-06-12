import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerCaliberTotentanzSTopDog = {
  id: "37529705-a5aa-45ec-9051-28cc2da4b6b4",
  externalId: "cyberpunk:caliber-totentanz-s-top-dog",
  slug: "caliber-totentanz-s-top-dog",
  name: "Caliber",
  subname: "Totentanz's Top Dog",
  displayName: "Caliber - Totentanz's Top Dog",
  rulesText:
    "DEFEATED A rival discards 1. If the card's cost is equal to the value of a friendly Gig, that rival discards 1 more.",
  flavorText: null,
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "036",
  printings: [
    {
      id: "1dc270af-9d87-4928-adae-52f741641a48",
      collectorNumber: "036",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b036.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b036.webp",
      set: {
        code: "spoiler",
        name: "Spoiler Set",
      },
      rarity: null,
      finish: "foil",
      artist: "André Lima Araújo with Chris O'Halloran",
    },
  ],
  selectedPrintingId: "1dc270af-9d87-4928-adae-52f741641a48",
  artist: "André Lima Araújo with Chris O'Halloran",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/spoiler/b036.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/b036.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 6,
  abilities: [
    {
      kind: "triggered",
      text: "DEFEATED A rival discards 1. If the card's cost is equal to the value of a friendly Gig, that rival discards 1 more.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
        },
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
          conditions: [
            {
              condition: "costMatchesGig",
              target: {
                selector: "context",
                key: "discardedCards",
              },
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
