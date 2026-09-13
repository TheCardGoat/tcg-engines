import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailUnlikelyBond = defineCyberpunkCard({
  id: "5b8f8d4f-c62e-4bde-a086-2ce15bd9449d",
  canonicalId: "unlikely-bond",
  slug: "unlikely-bond",
  name: "Unlikely Bond",
  displayName: "Unlikely Bond",
  rulesText: "Bottom-deck a ready friendly Unit. If you do, bottom-deck a spent rival Unit.",
  color: "blue",
  classifications: ["Maelstrom", "Mox"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "140",
  artist: "Fabrizio De Tommaso",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/140.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Bottom-deck a ready friendly Unit. If you do, bottom-deck a spent rival Unit.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "moveCard",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
              state: "ready",
              selection: { mode: "choose", min: 1, max: 1 },
            },
            destination: "deckBottom",
          },
          ifEffects: [
            {
              effect: "moveCard",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                state: "spent",
                selection: { mode: "choose", min: 1, max: 1 },
              },
              destination: "deckBottom",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 4,
}) satisfies ProgramCardDefinition;
