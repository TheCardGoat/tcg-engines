import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaSecondhandBombus = defineCyberpunkCard({
  id: "e89c8a35-8ecd-4fb2-88cc-8b2c5f204297",
  slug: "secondhand-bombus",
  rulesText:
    "This unit can't attack. BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
  name: "Secondhand Bombus",
  displayName: "Secondhand Bombus",
  canonicalId: "secondhand-bombus",
  color: "yellow",
  classifications: ["Zetatech", "Drone"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α014",
  artist: "Luca Claretti",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a014.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  keywords: ["blocker"],
  type: "unit",
  cost: 2,
  power: 2,
  abilities: [
    blockerAbility({
      text: "BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
    }),
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
}) satisfies UnitCardDefinition;
