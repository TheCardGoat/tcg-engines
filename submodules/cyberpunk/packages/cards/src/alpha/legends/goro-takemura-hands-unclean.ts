import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility, goSoloAbility } from "@tcg/cyberpunk-types";

export const alphaGoroTakemuraHandsUnclean = defineCyberpunkCard({
  id: "d2254af5-7235-4691-8f90-69368df24361",
  slug: "goro-takemura-hands-unclean",
  rulesText:
    "GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.) BLOCKER (When a rival units attacks, you may spend this unit to redirect the attack to this unit.)",
  subname: "Hands Unclean",
  name: "Goro Takemura",
  displayName: "Goro Takemura - Hands Unclean",
  canonicalId: "goro-takemura-hands-unclean",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α004",
  artist: "Bad Moon Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a004.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo", "blocker"],
  type: "legend",
  cost: 5,
  power: 7,
  abilities: [
    goSoloAbility({
      text: "GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)",
    }),
    blockerAbility({
      text: "BLOCKER (When a rival units attacks, you may spend this unit to redirect the attack to this unit.)",
    }),
  ],
}) satisfies LegendCardDefinition;
