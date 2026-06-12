import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailVCorporateExile = {
  id: "627186b3-cffb-4228-aed4-b3ee35235fb6",
  externalId: "cb-v-corporate-exile",
  slug: "v-corporate-exile",
  name: "V — Corporate Exile",
  subname: null,
  displayName: "V — Corporate Exile",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "blue",
  classifications: ["Corpo", "Merc"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "006",
  printings: [
    {
      id: "f509ebd8-c8b7-4a22-8922-2d71c6df0b6f",
      collectorNumber: "006",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/006.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/f509ebd8-c8b7-4a22-8922-2d71c6df0b6f/render-mpvt2j1n.webp",
      set: {
        code: "boxtoppersretail",
        name: "Box Toppers — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "4a5591f9-743e-4186-8deb-560971bb3f82",
      collectorNumber: "012",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/012.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/4a5591f9-743e-4186-8deb-560971bb3f82/render-mpwcmh92.webp",
      set: {
        code: "theheistretailstarterdeck",
        name: "The Heist — Retail Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Envar",
    },
    {
      id: "e44580df-d78d-4b09-bb53-edb1ee32ac96",
      collectorNumber: "β006",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersbeta/b006.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/e44580df-d78d-4b09-bb53-edb1ee32ac96/render-mpvsuwip.webp",
      set: {
        code: "boxtoppersbeta",
        name: "Box Toppers — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "a6511c82-3a16-41b3-a39a-5194897c8648",
      collectorNumber: "β012",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/theheistbetastarterdeck/b012.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/a6511c82-3a16-41b3-a39a-5194897c8648/render-mpwcctpo.webp",
      set: {
        code: "theheistbetastarterdeck",
        name: "The Heist — Beta Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Envar",
    },
  ],
  selectedPrintingId: "f509ebd8-c8b7-4a22-8922-2d71c6df0b6f",
  artist: "Envar Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/006.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/f509ebd8-c8b7-4a22-8922-2d71c6df0b6f/render-mpvt2j1n.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["goSolo"],
  type: "legend",
  cost: 5,
  power: 8,
  abilities: [
    {
      kind: "keyword",
      text: "GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
