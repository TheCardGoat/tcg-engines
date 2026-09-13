import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailValentinoStreetRacer = defineCyberpunkCard({
  id: "5d6afeed-1532-4a01-bb40-a011030a7785",
  canonicalId: "valentino-street-racer",
  slug: "valentino-street-racer",
  name: "Valentino Street Racer",
  displayName: "Valentino Street Racer",
  rulesText:
    "{Play} Give another friendly Unit with cost 5 or less {Adrenaline} this turn. (A Unit with Adrenaline can attack the turn it's played.)",
  color: "green",
  classifications: ["Valentino", "Vehicle"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "091",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/091.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "{Play} Give another friendly Unit with cost 5 or less {Adrenaline} this turn.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 5,
            excludeSelf: true,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          rule: "adrenaline",
          duration: "turn",
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 3,
}) satisfies UnitCardDefinition;
