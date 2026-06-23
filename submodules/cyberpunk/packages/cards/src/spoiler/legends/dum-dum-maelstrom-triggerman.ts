import type { SpoilerCardDefinition } from "@tcg/cyberpunk-types";

export const spoilerDumDumMaelstromTriggerman = {
  id: "15e5c60e-56c4-4a1a-a7cf-f208c5ffbee8",
  externalId: "cyberpunk:dum-dum-maelstrom-triggerman",
  slug: "dum-dum-maelstrom-triggerman",
  name: "Dum Dum",
  subname: "Maelstrom Triggerman",
  displayName: "Dum Dum - Maelstrom Triggerman",
  rulesText:
    "CALL You may defeat a friendly Gear. If you do, draw 4 cards. Otherwise, draw 1 card.",
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "133",
  printings: [
    {
      id: "fabf7f53-bf0e-4ddf-90ca-e0165ac7b99c",
      collectorNumber: "133",
      setCode: "spoiler",
      rarity: null,
    },
  ],
  selectedPrintingId: "fabf7f53-bf0e-4ddf-90ca-e0165ac7b99c",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/133.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: [],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "CALL You may defeat a friendly Gear. If you do, draw 4 cards. Otherwise, draw 1 card.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "defeat",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["gear"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 4,
            },
          ],
          elseEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
            },
          ],
        },
      ],
    },
  ],
  reminderText: [],
} satisfies SpoilerCardDefinition;
