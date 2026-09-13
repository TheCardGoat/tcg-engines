import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailHackedCorpo = defineCyberpunkCard({
  id: "d2a9bcb0-a5e1-4413-8140-8b808258a753",
  canonicalId: "hacked-corpo",
  slug: "hacked-corpo",
  name: "Hacked Corpo",
  displayName: "Hacked Corpo",
  rulesText: "{Play} Trash 3. Add a Program from among them to your hand.",
  color: "blue",
  classifications: ["AI", "Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "114",
  artist: "Luke Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/114.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  abilities: [
    {
      kind: "triggered",
      text: "Play Trash 3. Add a Program from among them to your hand.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 3,
          outputBinding: "trashedCards",
        },
        {
          effect: "moveCard",
          target: {
            selector: "bound",
            id: "trashedCards",
            cardTypes: ["program"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          destination: "hand",
          outputBinding: "recoveredProgram",
        },
      ],
    },
  ],
  type: "unit",
  cost: 4,
  power: 3,
}) satisfies UnitCardDefinition;
