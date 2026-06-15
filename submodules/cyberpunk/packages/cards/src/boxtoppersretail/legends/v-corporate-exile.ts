import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const boxTopperRetailVCorporateExile = {
  id: "627186b3-cffb-4228-aed4-b3ee35235fb6",
  externalId: "cb-v-corporate-exile",
  slug: "v-corporate-exile",
  name: "V — Corporate Exile",
  displayName: "V — Corporate Exile",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
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
      setCode: "boxtoppersretail",
      rarity: "Epic",
    },
    {
      id: "4a5591f9-743e-4186-8deb-560971bb3f82",
      collectorNumber: "012",
      setCode: "theheistretailstarterdeck",
      rarity: "Epic",
    },
    {
      id: "e44580df-d78d-4b09-bb53-edb1ee32ac96",
      collectorNumber: "β006",
      setCode: "boxtoppersbeta",
      rarity: "Epic",
    },
    {
      id: "a6511c82-3a16-41b3-a39a-5194897c8648",
      collectorNumber: "β012",
      setCode: "theheistbetastarterdeck",
      rarity: "Epic",
    },
  ],
  selectedPrintingId: "f509ebd8-c8b7-4a22-8922-2d71c6df0b6f",
  artist: "Envar Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/006.webp",
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
