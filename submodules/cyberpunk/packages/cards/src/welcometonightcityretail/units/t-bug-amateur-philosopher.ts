import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTBugAmateurPhilosopher = defineCyberpunkCard({
  id: "5a5a177c-6ed8-4bd9-8b11-13c2b64414e2",
  slug: "t-bug-amateur-philosopher",
  rulesText:
    "{Defeated} Look at all friendly face-down Legends. Then, you may Call a Legend for free. (You can only Call a Legend once per turn.)",
  name: "T-Bug — Amateur Philosopher",
  displayName: "T-Bug — Amateur Philosopher",
  canonicalId: "t-bug-amateur-philosopher",
  color: "yellow",
  classifications: ["Merc", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "055",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/055.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  type: "unit",
  cost: 4,
  power: 4,
  abilities: [
    {
      kind: "triggered",
      text: "Defeated Look at all friendly face-down Legends. Then, you may Call a Legend for free.",
      trigger: { trigger: "defeated" },
      source: { selector: "self" },
      effects: [
        {
          effect: "lookAt",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["legendArea"],
            cardTypes: ["legend"],
            face: "faceDown",
          },
          revealToOpponent: false,
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
            selection: { mode: "choose", min: 0, max: 1 },
          },
          free: true,
          optional: true,
        },
      ],
    },
  ],
  reminderText: ["You can only Call a Legend once per turn."],
}) satisfies UnitCardDefinition;
