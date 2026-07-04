import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailPeaceOffering = defineCyberpunkCard({
  id: "3b30f02d-84dd-402c-ab4b-87a2ec3badce",
  slug: "peace-offering",
  rulesText:
    "You may set a Gig's value to the value of another Gig. Then, if you control a value-pair, draw 1.",
  name: "Peace Offering",
  displayName: "Peace Offering",
  canonicalId: "peace-offering",
  color: "green",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "101",
  artist: "Mattia De Iulis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/101.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  type: "program",
  cost: 1,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "You may set a Gig's value to the value of another Gig. Then, if you control a value-pair, draw 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGigs",
          target: {
            selector: "gig",
            amount: 2,
            selection: {
              mode: "choose",
              min: 2,
              max: 2,
            },
          },
        },
      ],
      effects: [
        {
          effect: "copyGigValue",
          source: {
            selector: "bound",
            id: "selectedGigs",
            index: 0,
          },
          target: {
            selector: "bound",
            id: "selectedGigs",
            index: 1,
          },
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "hasGigPair",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
