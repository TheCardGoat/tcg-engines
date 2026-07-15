import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailJackedInVoodooBoy = defineCyberpunkCard({
  id: "b0453570-7ed8-4031-9562-cb73d7a979e5",
  canonicalId: "jacked-in-voodoo-boy",
  slug: "jacked-in-voodoo-boy",
  rulesText: "This Unit can't attack unless you played a Program this turn.",
  name: "Jacked-In Voodoo Boy",
  displayName: "Jacked-In Voodoo Boy",
  color: "blue",
  classifications: ["Netrunner", "Voodoo Boys"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "115",
  artist: "Josan Gonzalez (Deathburger)",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/115.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "static",
      text: "This Unit can't attack unless you played a Program this turn.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "requiresProgramPlayedThisTurn",
          duration: "continuous",
        },
      ],
    },
  ],
  type: "unit",
  cost: 2,
  power: 2,
}) satisfies UnitCardDefinition;
