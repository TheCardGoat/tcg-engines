import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaMantisBlades = defineCyberpunkCard({
  id: "40a0bf06-c63f-4989-ab66-268d8452a060",
  slug: "mantis-blades",
  rulesText: "(Equip to a unit or face-up legend.)",
  name: "Mantis Blades",
  displayName: "Mantis Blades",
  canonicalId: "mantis-blades",
  color: "red",
  classifications: ["Cyberware"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α019",
  artist: "Giada Marchisio, Kieran McKeown",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a019.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  type: "gear",
  cost: 1,
  power: 2,
  attachment: gearAttachmentToUnitOrLegend(),
}) satisfies GearCardDefinition;
