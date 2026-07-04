import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailIndustrialAssembly = defineCyberpunkCard({
  id: "a708461f-1f91-4789-bb0d-96e3de5fcf44",
  canonicalId: "industrial-assembly",
  slug: "industrial-assembly",
  rulesText: "Increase a Gig by up to 4. If you control a Gig with 8+ value, draw 1.",
  name: "Industrial Assembly",
  displayName: "Industrial Assembly",
  color: "red",
  classifications: ["Arasaka", "Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "033",
  artist: "Alexander Dudar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/033.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Increase a Gig by up to 4. If you control a Gig with 8+ value, draw 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            amount: 1,
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 4,
          direction: "increase",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetExists",
              target: {
                selector: "gig",
                controller: "friendly",
                minValue: 8,
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 1,
  power: null,
}) satisfies ProgramCardDefinition;
