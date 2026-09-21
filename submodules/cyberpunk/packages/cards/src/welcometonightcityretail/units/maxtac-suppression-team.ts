import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMaxtacSuppressionTeam = defineCyberpunkCard({
  id: "95840ebd-d00a-49ff-b4e5-e2064cfc13a9",
  canonicalId: "maxtac-suppression-team",
  slug: "maxtac-suppression-team",
  name: "MaxTac Suppression Team",
  displayName: "MaxTac Suppression Team",
  rulesText: "Rival Units can't attack the turn they're played.",
  color: "yellow",
  classifications: ["NCPD"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "050",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/050.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  abilities: [
    {
      kind: "static",
      text: "Rival Units can't attack the turn they're played.",
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            hasLag: true,
          },
          rule: "cantAttack",
          duration: "continuous",
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 7,
}) satisfies UnitCardDefinition;
