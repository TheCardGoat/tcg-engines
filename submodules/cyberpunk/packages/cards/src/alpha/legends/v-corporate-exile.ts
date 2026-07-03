import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const alphaVCorporateExile = defineCyberpunkCard({
  id: "1c73efa6-4685-48e5-9064-11f31c8e6357",
  slug: "v-corporate-exile",
  rulesText: "GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)",
  subname: "Corporate Exile",
  name: "V",
  displayName: "V - Corporate Exile",
  canonicalId: "v-corporate-exile",
  color: "blue",
  classifications: ["Merc", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α003",
  artist: "Envar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a003.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  type: "legend",
  cost: 5,
  power: 8,
  abilities: [
    goSoloAbility({
      text: "GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)",
    }),
  ],
}) satisfies LegendCardDefinition;
