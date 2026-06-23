import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaMantisBlades = {
  id: "40a0bf06-c63f-4989-ab66-268d8452a060",
  externalId: "cyberpunk:mantis-blades",
  slug: "mantis-blades",
  name: "Mantis Blades",
  displayName: "Mantis Blades",
  rulesText: "(Equip to a unit or face-up legend.)",
  color: "red",
  classifications: ["Cyberware"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α019",
  printings: [
    {
      id: "aec0d35f-5014-46fe-a9e5-bbd7f88dc729",
      collectorNumber: "α019",
      setCode: "alpha",
      rarity: null,
    },
  ],
  selectedPrintingId: "aec0d35f-5014-46fe-a9e5-bbd7f88dc729",
  artist: "Giada Marchisio, Kieran McKeown",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a019.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 1,
  power: 2,
  abilities: [],
  reminderText: [],
  attachment: gearAttachmentToUnitOrLegend(),
} satisfies AlphaCardDefinition;
