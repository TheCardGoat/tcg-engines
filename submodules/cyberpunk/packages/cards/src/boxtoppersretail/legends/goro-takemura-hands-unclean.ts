import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailGoroTakemuraHandsUnclean = {
  id: "72358c7d-9f29-4ef6-a682-f5bfc72c7714",
  externalId: "cb-goro-takemura-hands-unclean",
  slug: "goro-takemura-hands-unclean",
  name: "Goro Takemura — Hands Unclean",
  displayName: "Goro Takemura — Hands Unclean",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\n[BLOCKER] (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
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
      setCode: "boxtoppersretail",
      rarity: "Epic",
    },
    {
      id: "2ba68619-7050-44c5-b0ce-b32d48b8f40f",
      collectorNumber: "012",
      setCode: "embracingpowerretailstarterdeck",
      rarity: "Epic",
    },
    {
      id: "15430373-fafd-479c-84d4-5737c71d0850",
      collectorNumber: "β003",
      setCode: "boxtoppersbeta",
      rarity: "Epic",
    },
    {
      id: "25b09451-8cc8-4581-898d-3b5ee6ff6b14",
      collectorNumber: "β012",
      setCode: "embracingpowerbetastarterdeck",
      rarity: "Epic",
    },
  ],
  selectedPrintingId: "1b6e44dd-d6e7-46eb-a5e5-24c38eed888b",
  artist: "Bad Moon Studios",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/003.webp",
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
