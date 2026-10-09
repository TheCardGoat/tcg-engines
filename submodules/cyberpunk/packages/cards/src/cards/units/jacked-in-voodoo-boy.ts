import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { welcomeToNightCityRetailJackedInVoodooBoyI18n } from "./jacked-in-voodoo-boy.i18n.ts";

export const welcomeToNightCityRetailJackedInVoodooBoy = defineCyberpunkCard(
  {
    id: "b0453570-7ed8-4031-9562-cb73d7a979e5",
    canonicalId: "jacked-in-voodoo-boy",
    slug: "jacked-in-voodoo-boy",
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
  },
  welcomeToNightCityRetailJackedInVoodooBoyI18n,
) satisfies UnitCardDefinition;
