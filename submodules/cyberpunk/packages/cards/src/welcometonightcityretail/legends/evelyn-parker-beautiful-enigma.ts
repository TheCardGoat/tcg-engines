import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailEvelynParkerBeautifulEnigma = defineCyberpunkCard({
  id: "55807eb7-8a8e-44a9-97a2-c8ac993e7b43",
  slug: "evelyn-parker-beautiful-enigma",
  rulesText:
    "When a friendly CORPO or GANGER Unit steals 1 or more Gigs, ready 1 Eddie.\n1 €$, {Spend} A rival Unit must attack next turn if it can.",
  name: "Evelyn Parker — Beautiful Enigma",
  displayName: "Evelyn Parker — Beautiful Enigma",
  canonicalId: "evelyn-parker-beautiful-enigma",
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "107",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/107.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "When a friendly CORPO or GANGER Unit steals 1 or more Gigs, ready 1 Eddie.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          minAmount: 1,
          // Card text: "When a friendly CORPO or GANGER Unit steals 1 or more
          // Gigs" — restrict the thief (event source) to a friendly Corpo or
          // Ganger Unit so non-Corpo/Ganger thieves (e.g. a Program or Legend)
          // don't satisfy the trigger.
          source: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["unit"],
            classifications: ["Corpo", "Ganger"],
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "readyEddies",
          player: "friendly",
          amount: 1,
        },
      ],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND A rival Unit must attack next turn if it can.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
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
        },
      ],
      costs: [
        {
          cost: "payEddies",
          amount: 1,
        },
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "mustAttack",
          duration: "untilSourceNextTurn",
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
