import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
export const welcomeToNightCityRetailMaxtacHeavy = defineCyberpunkCard({
  id: "78fee308-5d4e-491c-9596-423dc20da5e3",
  canonicalId: "maxtac-heavy",
  slug: "maxtac-heavy",
  name: "MaxTac Heavy",
  displayName: "MaxTac Heavy",
  rulesText: "Play this Unit for -1 €$ for each of a Rival’s Units, to a minimum of 1 €$.",
  color: "green",
  classifications: ["NCPD"],
  set: { code: "welcometonightcityretail", name: "Welcome to Night City — Retail" },
  printNumber: "081",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/081.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  type: "unit",
  cost: 7,
  power: 8,
  costModifier: {
    reducer: "perTargetCount",
    reductionPerCount: 1,
    target: { selector: "card", controller: "rival", zones: ["field"], cardTypes: ["unit"] },
    min: 1,
  },
}) satisfies UnitCardDefinition;
