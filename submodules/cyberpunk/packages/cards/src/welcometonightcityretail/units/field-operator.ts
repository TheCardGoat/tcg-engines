import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailFieldOperator = defineCyberpunkCard({
  id: "4a8dfe3f-980d-4370-ac10-6bd989042cdf",
  canonicalId: "field-operator",
  slug: "field-operator",
  rulesText: "{Play} If your ☆ (Street Cred) is an even number, draw 1.",
  name: "Field Operator",
  displayName: "Field Operator",
  color: "green",
  classifications: ["Arasaka", "Corpo", "Techie"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "078",
  artist: "Michal Ivan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/078.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "{Play} If your ☆ (Street Cred) is an even number, draw 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "streetCredParity",
              controller: "friendly",
              parity: "even",
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 2,
}) satisfies UnitCardDefinition;
