import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAfterpartyAtLizzieS = defineCyberpunkCard({
  id: "d039e4b3-9b83-40da-8d8f-b1dfb1f172f1",
  slug: "afterparty-at-lizzie-s",
  rulesText:
    "Adjust a Gig by up to 1. If you control 2 or more Gigs with different values, draw 1.",
  name: "Afterparty at Lizzie's",
  displayName: "Afterparty at Lizzie's",
  canonicalId: "afterparty-at-lizzie-s",
  color: "yellow",
  classifications: ["Braindance", "Mox"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "065",
  artist: "Alicja Użarowska",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/065.webp",
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
      text: "Adjust a Gig by up to 1. If you control 2 or more Gigs with different values, draw 1.",
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
          maxAmount: 1,
          direction: "either",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "hasDistinctGigValues",
              controller: "friendly",
              minCount: 2,
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
