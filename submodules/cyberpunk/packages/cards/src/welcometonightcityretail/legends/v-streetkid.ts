import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailVStreetkid = {
  id: "81a8dec7-9541-4020-93e1-7d798a57dcbc",
  externalId: "cb-v-streetkid",
  slug: "v-streetkid",
  name: "V — StreetKid",
  displayName: "V — StreetKid",
  rulesText:
    "[CALL] Trash 3. Then, add 1 BRAINDANCE Program from your trash to your hand.\n[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
  color: "red",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "005a",
  printings: [
    {
      id: "3fc63c58-5954-4744-a5af-047bfc5cb159",
      collectorNumber: "005a",
      setCode: "welcometonightcityretail",
      rarity: "Rare",
    },
    {
      id: "c2d0e2a7-470f-4498-b6d5-5df1e3ecc3ef",
      collectorNumber: "005b",
      setCode: "welcometonightcityretail",
      rarity: "Rare",
    },
    {
      id: "79119e83-b50b-4a79-8a6c-f496d9ed7ef6",
      collectorNumber: "β005a",
      setCode: "welcometonightcitybeta",
      rarity: "Rare",
    },
    {
      id: "e6dbfd52-85c5-4fd4-a77c-ca829e827d8a",
      collectorNumber: "β005b",
      setCode: "welcometonightcitybeta",
      rarity: "Rare",
    },
  ],
  selectedPrintingId: "3fc63c58-5954-4744-a5af-047bfc5cb159",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/005a.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: ["goSolo"],
  type: "legend",
  cost: 5,
  power: 6,
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
      text: "CALL Trash 3. Then, add 1 BRAINDANCE Program from your trash to your hand. GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 3,
        },
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["program"],
            classifications: ["Braindance"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          destination: "hand",
        },
      ],
    },
  ],
  reminderText: [],
} satisfies StructuredCardDefinition;
