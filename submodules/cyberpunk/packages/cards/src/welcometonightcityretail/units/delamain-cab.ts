import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailDelamainCab = defineCyberpunkCard({
  id: "a1e60653-5e28-49ee-9798-d16520b553c3",
  canonicalId: "delamain-cab",
  slug: "delamain-cab",
  rulesText: "At the end of your turn, if this Unit stole a Gig this turn, ready 1 Eddie.",
  name: "Delamain Cab",
  displayName: "Delamain Cab",
  color: "blue",
  classifications: ["Vehicle"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "112",
  artist: "CD PROJEKT RED",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/112.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "At the end of your turn, if this Unit stole a Gig this turn, ready 1 Eddie.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
          },
          source: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "delayed",
          timing: "endOfTurn",
          effects: [
            {
              effect: "readyEddies",
              player: "friendly",
              amount: 1,
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 4,
  power: 4,
}) satisfies UnitCardDefinition;
