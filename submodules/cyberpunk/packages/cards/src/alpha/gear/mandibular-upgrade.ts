import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaMandibularUpgrade = defineCyberpunkCard({
  id: "26f4e997-178c-4c1a-96f3-edde024f0081",
  slug: "mandibular-upgrade",
  rulesText:
    "(Equip to a unit or face-up legend.) BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
  name: "Mandibular Upgrade",
  displayName: "Mandibular Upgrade",
  canonicalId: "mandibular-upgrade",
  color: "yellow",
  classifications: ["Cyberware", "Implant"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α027",
  artist: "Lea Leonowicz",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a027.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["blocker"],
  type: "gear",
  cost: 1,
  power: 0,
  abilities: [
    blockerAbility({
      text: "BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
      host: true,
    }),
  ],
  attachment: gearAttachmentToUnitOrLegend(),
}) satisfies GearCardDefinition;
