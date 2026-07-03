import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerCarnageAtTheColosseum = defineCyberpunkCard({
  id: "bd0ecde8-2aec-44cb-a11a-fb81bc34827a",
  slug: "carnage-at-the-colosseum",
  rulesText:
    "Play this Program for -1 €$ for each friendly Gig with 8+ value, to a minimum of 1 €$. Defeat a rival Unit with less power than a friendly Unit.",
  name: "Carnage At The Colosseum",
  displayName: "Carnage At The Colosseum",
  canonicalId: "carnage-at-the-colosseum",
  color: "red",
  classifications: ["Braindance", "Extreme"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "030",
  artist: "Matías Bergara",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/030.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["play"],
  type: "program",
  cost: 6,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Defeat a rival Unit with less power than a friendly Unit.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            powerLessThanAnyOf: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["unit"],
            },
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: {
      selector: "gig",
      controller: "friendly",
      amount: "all",
      minValue: 8,
    },
    min: 1,
  },
}) satisfies ProgramCardDefinition;
