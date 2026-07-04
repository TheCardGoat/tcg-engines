import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const theHeistRetailStarterDeckJackieWellesPourOneOutForMe = defineCyberpunkCard({
  id: "40502c1f-78a2-426a-a706-c60ebd4b31e3",
  slug: "jackie-welles-pour-one-out-for-me",
  rulesText:
    "The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
  name: "Jackie Welles — Pour One Out For Me",
  displayName: "Jackie Welles — Pour One Out For Me",
  canonicalId: "jackie-welles-pour-one-out-for-me",
  color: "blue",
  classifications: ["Merc"],
  set: {
    code: "theheistretailstarterdeck",
    name: "The Heist — Retail Starter Deck",
  },
  printNumber: "011",
  artist: "Envar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/011.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "The first time you play a Blue Unit or Blue Gear each turn, you may decrease a friendly Gig by up to 2. If it becomes a min Gig, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardPlayed",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["unit", "gear"],
            colors: ["blue"],
          },
        },
      },
      source: {
        selector: "self",
      },
      limits: ["firstTimeEachTurn"],
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            controller: "friendly",
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
          direction: "decrease",
          chooseUpTo: true,
          optional: true,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetValue",
              target: {
                selector: "bound",
                id: "selectedGig",
              },
              property: "gigValue",
              comparison: "eq",
              value: 1,
            },
          ],
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
