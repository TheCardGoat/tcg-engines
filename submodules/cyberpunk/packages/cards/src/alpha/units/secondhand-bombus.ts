import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaSecondhandBombus = {
  id: "e89c8a35-8ecd-4fb2-88cc-8b2c5f204297",
  externalId: "cyberpunk:secondhand-bombus",
  slug: "secondhand-bombus",
  name: "Secondhand Bombus",
  subname: null,
  displayName: "Secondhand Bombus",
  rulesText:
    "This unit can't attack. BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
  flavorText: null,
  color: "yellow",
  classifications: ["Zetatech", "Drone"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α014",
  printings: [
    {
      id: "ec4cbe7d-7697-4c27-b843-476de88d69a6",
      collectorNumber: "α014",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a014.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a014.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Luca Claretti",
    },
  ],
  selectedPrintingId: "ec4cbe7d-7697-4c27-b843-476de88d69a6",
  artist: "Luca Claretti",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a014.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a014.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: [],
  keywords: ["blocker"],
  type: "unit",
  cost: 2,
  power: 2,
  abilities: [
    AbilityBuilder.keyword()
      .keyword("blocker")
      .text(
        "BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
      )
      .source(target.self())
      .build(),
    AbilityBuilder.static()
      .text("This unit can't attack.")
      .effect(
        effect.grantRule({
          target: target.self(),
          rule: "cantAttack",
          duration: "continuous",
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
