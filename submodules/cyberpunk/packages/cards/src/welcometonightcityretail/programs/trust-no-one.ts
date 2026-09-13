import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTrustNoOne = defineCyberpunkCard({
  id: "ec857ab0-995e-4c32-84b6-7ba57b2f6137",
  canonicalId: "trust-no-one",
  slug: "trust-no-one",
  name: "Trust No One",
  displayName: "Trust No One",
  rulesText: "Decrease a Gig by up to 3. Then, if you control a min Gig, draw 1.",
  color: "blue",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "139",
  artist: "Jesús Hervás",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/139.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Decrease a Gig by up to 3. Then, if you control a min Gig, draw 1.",
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
          maxAmount: 3,
          direction: "decrease",
          chooseUpTo: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
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
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 1,
}) satisfies ProgramCardDefinition;
