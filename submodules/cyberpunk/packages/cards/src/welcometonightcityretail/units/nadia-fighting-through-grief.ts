import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailNadiaFightingThroughGrief = defineCyberpunkCard({
  id: "3c144d6a-0c1a-43e9-bd35-85d6fc46adef",
  canonicalId: "nadia-fighting-through-grief",
  slug: "nadia-fighting-through-grief",
  rulesText:
    "If a Rival controls more Gigs than you, this Unit can attack their Gig area the turn it's played.",
  name: "Nadia — Fighting Through Grief",
  displayName: "Nadia — Fighting Through Grief",
  color: "green",
  classifications: ["Medtech", "Trauma Team"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "083",
  artist: "Miguel Valderrama",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/083.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "static",
      text: "If a Rival controls more Gigs than you, this Unit can attack their Gig area the turn it's played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "canAttackRivalOnPlayedTurn",
          duration: "continuous",
          conditions: [
            {
              condition: "hasLag",
              target: {
                selector: "self",
              },
            },
            {
              condition: "gigCountComparison",
              controller: "rival",
              comparison: "gt",
              other: "friendly",
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 6,
  power: 8,
}) satisfies UnitCardDefinition;
