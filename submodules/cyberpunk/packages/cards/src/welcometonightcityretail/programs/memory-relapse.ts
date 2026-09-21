import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMemoryRelapse = defineCyberpunkCard({
  id: "0f7c1c54-0e2e-44a5-ac7f-5263fbab21d3",
  canonicalId: "memory-relapse",
  slug: "memory-relapse",
  name: "Memory Relapse",
  displayName: "Memory Relapse",
  rulesText:
    "Spend a rival Unit. It can't ready until your next turn. If your ☆ (Street Cred) is an even number, draw 1.",
  color: "green",
  classifications: ["Braindance"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "100",
  artist: "Max Fiumara",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/100.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Spend a rival Unit. It can't ready until your next turn. If your ☆ (Street Cred) is an even number, draw 1.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      bindings: [
        {
          id: "unit",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            state: "ready",
            selection: { mode: "choose", min: 1, max: 1 },
          },
        },
      ],
      effects: [
        { effect: "spend", target: { selector: "bound", id: "unit" } },
        {
          effect: "grantRule",
          target: { selector: "bound", id: "unit" },
          rule: "cantReady",
          duration: "untilSourceNextTurn",
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [{ condition: "streetCredParity", controller: "friendly", parity: "even" }],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
