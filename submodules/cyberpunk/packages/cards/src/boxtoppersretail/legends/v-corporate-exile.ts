import type { BoxToppersRetailCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const boxTopperRetailVCorporateExile = defineCyberpunkCard({
  id: "627186b3-cffb-4228-aed4-b3ee35235fb6",
  slug: "v-corporate-exile",
  canonicalId: "v-corporate-exile",
  name: "V — Corporate Exile",
  displayName: "V — Corporate Exile",
  rulesText:
    "[GO SOLO] (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
  color: "blue",
  classifications: ["Corpo", "Merc"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "006",
  artist: "Envar Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/006.webp",
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
      text: "GO SOLO (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. When it leaves the field, remove it from the game.)",
    }),
  ],
}) satisfies BoxToppersRetailCardDefinition;
