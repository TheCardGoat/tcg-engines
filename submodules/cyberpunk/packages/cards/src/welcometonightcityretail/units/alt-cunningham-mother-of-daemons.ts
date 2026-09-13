import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAltCunninghamMotherOfDaemons = defineCyberpunkCard({
  id: "858e95f5-2efb-460e-b890-e8a5140e11c9",
  canonicalId: "alt-cunningham-mother-of-daemons",
  slug: "alt-cunningham-mother-of-daemons",
  subname: "Mother of Daemons",
  name: "Alt Cunningham",
  displayName: "Alt Cunningham: Mother of Daemons",
  rulesText:
    "When a friendly equipped Unit or Legend is spent, draw 1.\nWhen a rival Unit would steal a Gig, you may discard 1 with cost equal to that Gig's value. If you do, the Gig isn't stolen.",
  color: "yellow",
  classifications: ["Merc", "Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "042",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/042.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  abilities: [
    {
      kind: "triggered",
      text: "When a friendly equipped Unit or Legend is spent, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardSpent",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field", "legendArea"],
            cardTypes: ["unit", "legend"],
            hasAttachedCards: true,
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
        },
      ],
    },
    {
      kind: "static",
      text: "When a rival Unit would steal a Gig, you may discard 1 with cost equal to that Gig's value. If you do, the Gig isn't stolen.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "preventsGigStealByDiscard",
          duration: "continuous",
        },
      ],
    },
  ],
  type: "unit",
  cost: 7,
  power: 8,
}) satisfies UnitCardDefinition;
