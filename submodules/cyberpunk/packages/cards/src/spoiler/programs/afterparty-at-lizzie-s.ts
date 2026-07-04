import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerAfterpartyAtLizzieS = defineCyberpunkCard({
  id: "80681ab5-9420-4967-a9c8-d9fa0f3a0cd9",
  slug: "afterparty-at-lizzie-s",
  rulesText:
    "Adjust a rival Gig by up to ±2. Then, if a friendly Gig has the same value, draw a card.",
  name: "Afterparty at Lizzie's",
  displayName: "Afterparty at Lizzie's",
  canonicalId: "afterparty-at-lizzie-s",
  color: "yellow",
  classifications: ["Braindance", "Mox"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "116",
  artist: "Alicja Użarowska",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/116.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Adjust a rival Gig by up to ±2. Then, if a friendly Gig has the same value, draw a card.",
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
            controller: "rival",
            selection: {
              mode: "choose",
              min: 1,
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
          maxAmount: 2,
          direction: "either",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "matchingGig",
              controller: "friendly",
              target: {
                selector: "bound",
                id: "selectedGig",
              },
              property: "value",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
