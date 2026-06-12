import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaSandevistan = {
  id: "db4140f6-415c-4d67-b4a6-1ce28a0a8719",
  externalId: "cyberpunk:sandevistan",
  slug: "sandevistan",
  name: "Sandevistan",
  subname: null,
  displayName: "Sandevistan",
  rulesText:
    "(Equip to a unit or face-up legend.) PLAY This unit can attack spent units this turn.",
  flavorText: null,
  color: "green",
  classifications: ["Cyberware"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α024",
  printings: [
    {
      id: "37a6293e-df23-47b5-9d4a-235038004b39",
      collectorNumber: "α024",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a024.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a024.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "CD PROJEKT RED",
    },
  ],
  selectedPrintingId: "37a6293e-df23-47b5-9d4a-235038004b39",
  artist: "CD PROJEKT RED",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a024.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a024.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: ["play"],
  keywords: [],
  type: "gear",
  cost: 3,
  power: 3,
  abilities: [
    AbilityBuilder.triggered()
      .text("PLAY This unit can attack spent units this turn.")
      .onPlay()
      .source(target.host())
      .effect(
        effect.grantRule({
          target: target.host(),
          rule: "canAttackOnPlayedTurnAgainstUnits",
          duration: "turn",
        }),
      )
      .build(),
  ],
  reminderText: [],
  attachment: gearAttachmentToUnitOrLegend(),
} satisfies AlphaCardDefinition;
