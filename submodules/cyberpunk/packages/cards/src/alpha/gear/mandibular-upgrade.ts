import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaMandibularUpgrade = {
  id: "26f4e997-178c-4c1a-96f3-edde024f0081",
  externalId: "cyberpunk:mandibular-upgrade",
  slug: "mandibular-upgrade",
  name: "Mandibular Upgrade",
  subname: null,
  displayName: "Mandibular Upgrade",
  rulesText:
    "(Equip to a unit or face-up legend.) BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
  flavorText: null,
  color: "yellow",
  classifications: ["Cyberware", "Implant"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α027",
  printings: [
    {
      id: "a44f9d62-86f3-4ede-9e0f-50477fa4229c",
      collectorNumber: "α027",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a027.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a027.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Lea Leonowicz",
    },
  ],
  selectedPrintingId: "a44f9d62-86f3-4ede-9e0f-50477fa4229c",
  artist: "Lea Leonowicz",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a027.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a027.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["blocker"],
  type: "gear",
  cost: 1,
  power: 0,
  abilities: [
    AbilityBuilder.keyword()
      .keyword("blocker")
      .text(
        "BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
      )
      .source(target.host())
      .build(),
  ],
  reminderText: [],
  attachment: gearAttachmentToUnitOrLegend(),
} satisfies AlphaCardDefinition;
