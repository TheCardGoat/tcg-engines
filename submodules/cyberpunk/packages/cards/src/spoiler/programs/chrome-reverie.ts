import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerChromeReverie = defineCyberpunkCard({
  id: "a5e0cd15-861f-46ac-b6e9-db5e30acfc82",
  slug: "chrome-reverie",
  rulesText:
    "A rival Unit can't attack until your next turn. If you control a min Gig, you may Call a Legend for free. (You can only Call a Legend once per turn.)",
  name: "Chrome Reverie",
  displayName: "Chrome Reverie",
  canonicalId: "chrome-reverie",
  color: "blue",
  classifications: ["Braindance"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "131a",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/131a.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "A rival Unit can't attack until your next turn. If you control a min Gig, you may Call a Legend for free.",
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
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          rule: "cantAttack",
          duration: "untilSourceNextTurn",
          optional: true,
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
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          free: true,
          optional: true,
          conditions: [
            {
              condition: "hasMinGig",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: [
    "You can only Call a Legend once per turn.",
    "Discard programs after they resolve.",
  ],
}) satisfies ProgramCardDefinition;
