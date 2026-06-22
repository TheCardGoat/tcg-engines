import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerRoyceDonTCallMeSimon = {
  id: "960d1a34-9451-4d5d-a47f-a33bb2578b4b",
  externalId: "cyberpunk:royce-don-t-call-me-simon",
  slug: "royce-don-t-call-me-simon",
  name: "Royce",
  subname: "Don't Call Me Simon",
  displayName: "Royce - Don't Call Me Simon",
  rulesText:
    "PLAY Defeat a rival Unit with power 2 or less. If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 3 or less instead.",
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "016",
  printings: [
    {
      id: "396f1873-b2f0-47f0-abda-f9d9e0c20bb5",
      collectorNumber: "016",
      setCode: "spoiler",
      rarity: null,
    },
  ],
  selectedPrintingId: "396f1873-b2f0-47f0-abda-f9d9e0c20bb5",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/016.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat a rival Unit with power 2 or less. If you have more ☆ (Street Cred) than a Rival, defeat a rival Unit with power 3 or less instead.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 3,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "gt",
              other: "rival",
            },
          ],
        },
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 2,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "lte",
              other: "rival",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
