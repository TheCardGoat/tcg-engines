import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailGoroTakemuraHandsUnclean = {
  id: "72358c7d-9f29-4ef6-a682-f5bfc72c7714",
  externalId: "cb-goro-takemura-hands-unclean",
  slug: "goro-takemura-hands-unclean",
  name: "Goro Takemura — Hands Unclean",
  subname: null,
  displayName: "Goro Takemura — Hands Unclean",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\n[BLOCKER] (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  flavorText: null,
  description: null,
  youtubeUrl: null,
  sourceUrl: null,
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "003",
  printings: [
    {
      id: "1b6e44dd-d6e7-46eb-a5e5-24c38eed888b",
      collectorNumber: "003",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/003.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/1b6e44dd-d6e7-46eb-a5e5-24c38eed888b/render-mpvt1uzv.webp",
      set: {
        code: "boxtoppersretail",
        name: "Box Toppers — Retail",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "2ba68619-7050-44c5-b0ce-b32d48b8f40f",
      collectorNumber: "012",
      imageUrl:
        "https://r2.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/012.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/2ba68619-7050-44c5-b0ce-b32d48b8f40f/render-mpwbuq0n.webp",
      set: {
        code: "embracingpowerretailstarterdeck",
        name: "Embracing Power — Retail Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Bad Moon Studio",
    },
    {
      id: "15430373-fafd-479c-84d4-5737c71d0850",
      collectorNumber: "β003",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersbeta/b003.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/15430373-fafd-479c-84d4-5737c71d0850/render-mpvsteul.webp",
      set: {
        code: "boxtoppersbeta",
        name: "Box Toppers — Beta",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Unknown",
    },
    {
      id: "25b09451-8cc8-4581-898d-3b5ee6ff6b14",
      collectorNumber: "β012",
      imageUrl:
        "https://r2.tcg.online/public/cyberpunk/cards/embracingpowerbetastarterdeck/b012.webp",
      sourceImageUrl:
        "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/25b09451-8cc8-4581-898d-3b5ee6ff6b14/render-mpwblnux.webp",
      set: {
        code: "embracingpowerbetastarterdeck",
        name: "Embracing Power — Beta Starter Deck",
      },
      rarity: "Epic",
      finish: "standard",
      artist: "Bad Moon Studio",
    },
  ],
  selectedPrintingId: "1b6e44dd-d6e7-46eb-a5e5-24c38eed888b",
  artist: "Bad Moon Studios",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/boxtoppersretail/003.webp",
  sourceImageUrl:
    "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/portal/1b6e44dd-d6e7-46eb-a5e5-24c38eed888b/render-mpvt1uzv.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["goSolo", "blocker"],
  type: "legend",
  cost: 5,
  power: 7,
  abilities: [
    {
      kind: "keyword",
      text: "GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
      keyword: "goSolo",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "keyword",
      text: "BLOCKER (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
      keyword: "blocker",
      source: {
        selector: "self",
      },
      effects: [],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
