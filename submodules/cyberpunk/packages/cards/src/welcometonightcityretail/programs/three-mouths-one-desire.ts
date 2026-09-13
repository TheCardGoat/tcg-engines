import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailThreeMouthsOneDesire = defineCyberpunkCard({
  id: "2993d637-d44d-4add-8473-26d67c0d1bc0",
  canonicalId: "three-mouths-one-desire",
  slug: "three-mouths-one-desire",
  name: "Three Mouths, One Desire",
  displayName: "Three Mouths, One Desire",
  rulesText:
    "Search the top 3 cards of your deck. Add 1 to your hand. You may add 1 more for each friendly min Gig. Bottom-deck the rest.",
  color: "blue",
  classifications: ["Braindance", "Doll"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "137",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/137.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Search the top 3 cards of your deck. Add 1 to your hand. You may add 1 more for each friendly min Gig. Bottom-deck the rest.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 3,
          target: { selector: "card", controller: "friendly", zones: ["deck"] },
          select: {
            kind: "upTo",
            max: {
              type: "basePlusPerCount",
              base: 1,
              multiplier: 1,
              target: {
                selector: "gig",
                controller: "friendly",
                amount: "all",
                minValue: 1,
                maxValue: 1,
              },
            },
          },
          reveal: false,
          destination: "hand",
          remainder: { zone: "deckBottom", order: "random" },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
