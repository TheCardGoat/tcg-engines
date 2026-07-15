import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience = defineCyberpunkCard({
  id: "5a441989-2997-40a2-a72e-08ca1442a7f3",
  canonicalId: "kerry-eurodyne-axe-attitude-audience",
  slug: "kerry-eurodyne-axe-attitude-audience",
  rulesText:
    "When you roll in a Gig from your fixer area, you may ignore the result and reroll it once.\nWhen you roll a min or max value on a Gig, draw 1. If it's a d20, draw 3 instead.",
  name: "Kerry Eurodyne — Axe, Attitude, Audience",
  displayName: "Kerry Eurodyne — Axe, Attitude, Audience",
  color: "yellow",
  classifications: ["Rocker", "Samurai"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "037",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/037.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When you roll in a Gig from your fixer area, you may ignore the result and reroll it once.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigRolled",
          player: "friendly",
          origin: "gainGig",
          target: {
            selector: "gig",
            controller: "friendly",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "rerollGig",
          target: {
            selector: "context",
            key: "triggeredGigs",
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
          optional: true,
        },
      ],
    },
    {
      kind: "triggered",
      text: "When you roll a min or max value on a Gig, draw 1. If it's a d20, draw 3 instead.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigRolled",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "friendly",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetValue",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              property: "gigValue",
              comparison: "eq",
              value: "min",
            },
          ],
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetValue",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              property: "gigValue",
              comparison: "eq",
              value: "max",
            },
          ],
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "gigSides",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              sides: "d20",
            },
            {
              condition: "targetValue",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              property: "gigValue",
              comparison: "eq",
              value: "min",
            },
          ],
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "gigSides",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              sides: "d20",
            },
            {
              condition: "targetValue",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              property: "gigValue",
              comparison: "eq",
              value: "max",
            },
          ],
        },
      ],
    },
  ],
  type: "legend",
  cost: null,
  power: null,
}) satisfies LegendCardDefinition;
