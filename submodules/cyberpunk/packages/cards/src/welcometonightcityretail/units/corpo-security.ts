import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailCorpoSecurity = defineCyberpunkCard({
  id: "71652e73-984a-4630-be47-af947f87d5c1",
  slug: "corpo-security",
  rulesText:
    "This Unit can't attack.\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
  name: "Corpo Security",
  displayName: "Corpo Security",
  canonicalId: "corpo-security",
  color: "green",
  classifications: ["Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "076",
  artist: "CD PROJEKT RED",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/076.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  keywords: ["blocker"],
  type: "unit",
  cost: 2,
  power: 2,
  abilities: [
    blockerAbility(),
    {
      kind: "static",
      text: "This Unit can't attack.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "self",
          },
          rule: "cantAttack",
          duration: "continuous",
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
