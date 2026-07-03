import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaSandevistan = defineCyberpunkCard({
  id: "db4140f6-415c-4d67-b4a6-1ce28a0a8719",
  slug: "sandevistan",
  rulesText:
    "(Equip to a unit or face-up legend.) PLAY This unit can attack spent units this turn.",
  name: "Sandevistan",
  displayName: "Sandevistan",
  canonicalId: "sandevistan",
  color: "green",
  classifications: ["Cyberware"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α024",
  artist: "CD PROJEKT RED",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a024.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: ["play"],
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
  attachment: gearAttachmentToUnitOrLegend(),
}) satisfies GearCardDefinition;
