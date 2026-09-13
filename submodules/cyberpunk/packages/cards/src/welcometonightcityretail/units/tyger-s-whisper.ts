import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
export const welcomeToNightCityRetailTygerSWhisper = defineCyberpunkCard({
  id: "31e5b986-1e67-439c-81fc-49f8938bd002",
  canonicalId: "tyger-s-whisper",
  slug: "tyger-s-whisper",
  name: "Tyger's Whisper",
  displayName: "Tyger's Whisper",
  rulesText:
    "{Play} You may Call a Legend for free. (You can only Call a Legend once per turn.)\n(Units with power 0 don't steal Gigs.)",
  color: "green",
  classifications: ["Fixer", "Tyger Claws"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "090",
  artist: "Bernard Kowalczuk",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/090.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: ["play"],
  type: "unit",
  cost: 2,
  power: 0,
  abilities: [
    {
      kind: "triggered",
      text: "Play You may Call a Legend for free.",
      trigger: { trigger: "play" },
      source: { selector: "self" },
      effects: [
        {
          effect: "callLegend",
          player: "friendly",
          free: true,
          optional: true,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["legendArea"],
            cardTypes: ["legend"],
            face: "faceDown",
            selection: { mode: "choose", min: 1, max: 1 },
          },
        },
      ],
    },
  ],
  reminderText: [
    "You can only Call a Legend once per turn.",
    "Units with power 0 don't steal Gigs.",
  ],
}) satisfies UnitCardDefinition;
