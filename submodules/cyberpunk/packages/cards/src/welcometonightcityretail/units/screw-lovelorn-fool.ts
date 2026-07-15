import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailScrewLovelornFool = defineCyberpunkCard({
  id: "7a62beca-ac54-4c0d-847d-ed85838c5093",
  canonicalId: "screw-lovelorn-fool",
  slug: "screw-lovelorn-fool",
  rulesText: "{Defeated} Add another Unit from your trash to your hand.",
  name: "Screw — Lovelorn Fool",
  displayName: "Screw — Lovelorn Fool",
  color: "red",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "018",
  artist: "Rion Chow",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/018.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "{Defeated} Add another Unit from your trash to your hand.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["unit"],
            excludeSelf: true,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          destination: "hand",
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 7,
}) satisfies UnitCardDefinition;
