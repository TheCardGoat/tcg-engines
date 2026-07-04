import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const theHeistRetailStarterDeckVCorporateExile = defineCyberpunkCard({
  id: "627186b3-cffb-4228-aed4-b3ee35235fb6",
  slug: "v-corporate-exile",
  rulesText:
    "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
  name: "V — Corporate Exile",
  displayName: "V — Corporate Exile",
  canonicalId: "v-corporate-exile",
  color: "blue",
  classifications: ["Corpo", "Merc"],
  set: {
    code: "theheistretailstarterdeck",
    name: "The Heist — Retail Starter Deck",
  },
  printNumber: "012",
  artist: "Envar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/012.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  type: "legend",
  cost: 5,
  power: 8,
  abilities: [
    goSoloAbility({
      text: "Go Solo (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
    }),
  ],
}) satisfies LegendCardDefinition;
