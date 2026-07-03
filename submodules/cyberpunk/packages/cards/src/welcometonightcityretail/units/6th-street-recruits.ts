import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetail6thStreetRecruits = defineCyberpunkCard({
  id: "e48c9d39-ef27-4b8f-8690-d75c3a4807b0",
  slug: "6th-street-recruits",
  rulesText: "When a friendly Unit steals a d6, increase a Gig by up to 6.",
  name: "6th Street Recruits",
  displayName: "6th Street Recruits",
  canonicalId: "6th-street-recruits",
  color: "red",
  classifications: ["6th Street", "Ganger"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "006",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/006.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  abilities: [
    {
      kind: "triggered",
      text: "When a friendly Unit steals a d6, increase a Gig by up to 6.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            sides: "d6",
          },
          source: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
          },
        },
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            controller: "friendly",
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
          maxAmount: 6,
          direction: "increase",
          chooseUpTo: true,
        },
      ],
    },
  ],
  type: "unit",
  cost: 4,
  power: 6,
}) satisfies UnitCardDefinition;
