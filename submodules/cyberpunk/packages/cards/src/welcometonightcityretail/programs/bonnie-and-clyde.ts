import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailBonnieAndClyde = defineCyberpunkCard({
  id: "3eb0f8bf-afb9-42a7-a4fa-710e2eb5c89c",
  slug: "bonnie-and-clyde",
  rulesText:
    "Defeat a rival Unit with power 4 or less. You may defeat 2 instead if a Rival controls at least 2 Gigs more than you.",
  name: "Bonnie and Clyde",
  displayName: "Bonnie and Clyde",
  canonicalId: "bonnie-and-clyde",
  color: "red",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "029",
  artist: "Rion Chow",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/029.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Defeat a rival Unit with power 4 or less. You may defeat 2 instead if a Rival controls at least 2 Gigs more than you.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        // Base case: Rival does NOT control 2+ more Gigs → defeat exactly 1.
        {
          effect: "defeat",
          conditions: [
            {
              condition: "gigCountDifference",
              controller: "rival",
              comparison: "lt",
              other: "friendly",
              value: 2,
            },
          ],
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 4,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
        // Upgrade case: Rival controls 2+ more Gigs → defeat up to 2.
        {
          effect: "defeat",
          conditions: [
            {
              condition: "gigCountDifference",
              controller: "rival",
              comparison: "gte",
              other: "friendly",
              value: 2,
            },
          ],
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 4,
            selection: {
              mode: "choose",
              min: 1,
              max: 2,
            },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
