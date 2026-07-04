import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerEvelynParkerBeautifulEnigma = defineCyberpunkCard({
  id: "1636c26f-189b-494d-96fc-6eb3df564d2f",
  slug: "evelyn-parker-beautiful-enigma",
  rulesText:
    "CALL Decrease a rival Gig's value by 3. [Spend Icon]: Search the top 3 cards of your deck for up to 1 Braindance Program. Add it to your hand. Bottom-deck the rest.",
  subname: "Beautiful Enigma",
  name: "Evelyn Parker",
  displayName: "Evelyn Parker - Beautiful Enigma",
  canonicalId: "evelyn-parker-beautiful-enigma",
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "122",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/122.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "CALL Decrease a rival Gig's value by 3.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyGig",
          target: {
            selector: "gig",
            controller: "rival",
          },
          operation: "decrease",
          value: 3,
        },
      ],
    },
    {
      kind: "triggered",
      text: "[Spend Icon]: Search the top 3 cards of your deck for up to 1 Braindance Program. Add it to your hand. Bottom-deck the rest.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 3,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
            cardTypes: ["program"],
            classifications: ["Braindance"],
          },
          select: {
            kind: "upTo",
            max: 1,
          },
          reveal: false,
          destination: "hand",
          remainder: {
            zone: "deckBottom",
          },
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
