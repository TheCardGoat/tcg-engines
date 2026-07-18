import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor = defineCyberpunkCard({
  id: "380b5e52-2651-4cde-8222-1db2ae6469e2",
  canonicalId: "hanako-arasaka-daughter-of-the-emperor",
  slug: "hanako-arasaka-daughter-of-the-emperor",
  name: "Hanako Arasaka — Daughter of the Emperor",
  displayName: "Hanako Arasaka — Daughter of the Emperor",
  rulesText:
    "{Spend} Swap a friendly Gig with a rival Gig.\nAt the start of your turn, draw 1 for each friendly value-pair of Gigs.",
  color: "green",
  classifications: ["Arasaka", "Corpo", "Netrunner"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "072",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/072.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  abilities: [
    {
      kind: "triggered",
      text: "SPEND Swap a friendly Gig with a rival Gig.",
      trigger: { trigger: "activated" },
      source: { selector: "self" },
      bindings: [
        {
          id: "friendlyGig",
          target: {
            selector: "gig",
            controller: "friendly",
            amount: 1,
            selection: { mode: "choose", min: 1, max: 1 },
          },
        },
        {
          id: "rivalGig",
          target: {
            selector: "gig",
            controller: "rival",
            amount: 1,
            selection: { mode: "choose", min: 1, max: 1 },
          },
        },
      ],
      costs: [{ cost: "spend", target: { selector: "self" } }],
      effects: [
        {
          effect: "swapGigs",
          friendly: { selector: "bound", id: "friendlyGig" },
          rival: { selector: "bound", id: "rivalGig" },
        },
      ],
    },
    {
      kind: "triggered",
      text: "At the start of your turn, draw 1 for each friendly value-pair of Gigs.",
      trigger: {
        trigger: "event",
        event: { event: "turnStarted", player: "friendly" },
      },
      source: { selector: "self" },
      effects: [
        {
          effect: "forEachFriendlyGigPair",
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
