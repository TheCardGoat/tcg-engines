import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailFoolOnTheHill = defineCyberpunkCard({
  id: "c5d2fed1-1470-4ac5-9f84-bf66705901ce",
  slug: "fool-on-the-hill",
  rulesText:
    "Reveal the top 2 cards of your deck. A Rival chooses whether you add them to your hand or trash them. If you trash them, draw 2.",
  name: "Fool on the Hill",
  displayName: "Fool on the Hill",
  canonicalId: "fool-on-the-hill",
  color: "green",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "099",
  artist: "DOFRESH",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/099.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Reveal the top 2 cards of your deck. A Rival chooses whether you add them to your hand or trash them. If you trash them, draw 2.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "rivalRevealChoice",
          player: "friendly",
          lookCount: 2,
          destinations: ["hand", "trash"],
          drawIfDestination: {
            destination: "trash",
            player: "friendly",
            amount: 2,
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
