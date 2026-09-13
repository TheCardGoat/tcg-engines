import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailViktorVektorDropYourIllusions = defineCyberpunkCard({
  id: "92d23553-8b0d-49cd-8cbe-6f00b3377298",
  canonicalId: "viktor-vektor-drop-your-illusions",
  slug: "viktor-vektor-drop-your-illusions",
  subname: "Drop Your Illusions",
  name: "Viktor Vektor",
  displayName: "Viktor Vektor: Drop Your Illusions",
  rulesText: "Play your first CYBERWARE Gear each turn for -3 €$, to a minimum of 1 €$.",
  color: "yellow",
  classifications: ["Ripperdoc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "057",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/057.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "static",
      text: "Play your first CYBERWARE Gear each turn for -3 €$, to a minimum of 1 €$.",
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "grantCostModifier",
          player: "friendly",
          appliesTo: {
            selector: "card",
            controller: "friendly",
            zones: ["hand"],
            cardTypes: ["gear"],
            classifications: ["Cyberware"],
          },
          modifier: {
            reducer: "flat",
            amount: 3,
            min: 1,
          },
          duration: "continuous",
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 5,
}) satisfies UnitCardDefinition;
