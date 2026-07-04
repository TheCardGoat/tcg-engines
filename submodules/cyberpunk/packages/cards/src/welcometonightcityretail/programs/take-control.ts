import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTakeControl = defineCyberpunkCard({
  id: "1535c19d-54e5-4289-9cb7-15ab429c0092",
  slug: "take-control",
  rulesText:
    "{Quick} A rival Unit steals 1 fewer Gig this turn. If that Unit is an AI, DRONE, or VEHICLE, draw 1.",
  name: "Take Control",
  displayName: "Take Control",
  canonicalId: "take-control",
  color: "green",
  classifications: ["Quickhack"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "103",
  artist: "RUDCEF",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/103.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: ["quick"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "keyword",
      text: "QUICK",
      keyword: "quick",
      source: {
        selector: "self",
      },
      effects: [],
    },
    {
      kind: "triggered",
      text: "A rival Unit steals 1 fewer Gig this turn. If that Unit is an AI, DRONE, or VEHICLE, draw 1.",
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
            selector: "attacker",
          },
          rule: "stealsOneFewerGig",
          duration: "turn",
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetExists",
              target: {
                selector: "attacker",
                classifications: ["AI", "Drone", "Vehicle"],
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
