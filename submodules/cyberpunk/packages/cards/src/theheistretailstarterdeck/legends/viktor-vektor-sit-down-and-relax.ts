import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const theHeistRetailStarterDeckViktorVektorSitDownAndRelax = defineCyberpunkCard({
  id: "f090dc44-d7f0-4aec-a19e-9213155a6611",
  slug: "viktor-vektor-sit-down-and-relax",
  rulesText:
    "{Call} Search the top 5 cards of your deck. Reveal up to 2 Gears with cost 2 or less and add them to your hand. Bottom-deck the rest in a random order.",
  name: "Viktor Vektor — Sit Down and Relax",
  displayName: "Viktor Vektor — Sit Down and Relax",
  canonicalId: "viktor-vektor-sit-down-and-relax",
  color: "yellow",
  classifications: ["Merc", "Ripperdoc"],
  set: {
    code: "theheistretailstarterdeck",
    name: "The Heist — Retail Starter Deck",
  },
  printNumber: "001",
  artist: "Envar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/001.webp",
  rarity: "Epic",
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
      text: "CALL Search the top 5 cards of your deck. Reveal up to 2 Gears with cost 2 or less and add them to your hand. Bottom-deck the rest in a random order.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 5,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
            cardTypes: ["gear"],
            maxCost: 2,
          },
          select: {
            kind: "upTo",
            max: 2,
          },
          reveal: true,
          destination: "hand",
          remainder: {
            zone: "deckBottom",
            order: "random",
          },
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
