import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailChromeReverie = {
  id: "a5e0cd15-861f-46ac-b6e9-db5e30acfc82",
  externalId: "cb-chrome-reverie",
  slug: "chrome-reverie",
  name: "Chrome Reverie",
  displayName: "Chrome Reverie",
  rulesText:
    "A rival Unit can't attack until your next turn. If you control a min Gig, you may Call a Legend for free. (You can only Call a Legend once per turn.)",
  color: "blue",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "131",
  printings: [
    {
      id: "3f0319b8-e315-4e71-85b7-147a5b8ceba5",
      collectorNumber: "131",
      setCode: "welcometonightcityretail",
      rarity: "Common",
    },
    {
      id: "0be394e3-ce41-4f16-a95b-33ec951bf43c",
      collectorNumber: "β131",
      setCode: "welcometonightcitybeta",
      rarity: "Common",
    },
  ],
  selectedPrintingId: "3f0319b8-e315-4e71-85b7-147a5b8ceba5",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/131.webp",
  rarity: "Common",
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
} satisfies StructuredCardDefinition;
