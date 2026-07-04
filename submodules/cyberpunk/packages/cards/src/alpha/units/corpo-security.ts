import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";
import { AbilityBuilder } from "../../helpers/builders/index.ts";
import { effect } from "../../helpers/builders/index.ts";
import { target } from "../../helpers/builders/index.ts";

export const alphaCorpoSecurity = defineCyberpunkCard({
  id: "b6652036-bbe2-407d-9c33-cce1147dbb7e",
  slug: "corpo-security",
  rulesText:
    "This unit can't attack. BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
  name: "Corpo Security",
  displayName: "Corpo Security",
  canonicalId: "corpo-security",
  color: "green",
  classifications: ["Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α016",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a016.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
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
