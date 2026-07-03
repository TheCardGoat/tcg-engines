import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaDyingNightVSPistol = defineCyberpunkCard({
  id: "fe99da63-8c6b-412b-b4e6-e24ce0de34c1",
  slug: "dying-night-v-s-pistol",
  rulesText:
    "(Equip to a unit or face-up legend.) ATTACK If you have 7+ * (Street Cred), defeat a rival gear card that costs 2 or less.",
  subname: "V's Pistol",
  name: "Dying Night",
  displayName: "Dying Night - V's Pistol",
  canonicalId: "dying-night-v-s-pistol",
  color: "blue",
  classifications: ["Weapon", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α022",
  artist: "Ivan Shavrin",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a022.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["attack"],
  type: "gear",
  cost: 2,
  power: 2,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK If you have 7+ Street Cred, defeat a rival gear card that costs 2 or less.")
      .onAttack()
      .source(target.host())
      .effect(
        effect.defeat({
          target: target.card({
            controller: "rival",
            zones: ["field", "legendArea"],
            cardTypes: ["gear"],
            maxCost: 2,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
          conditions: [
            condition.streetCred({ controller: "friendly", comparison: "gte", value: 7 }),
          ],
        }),
      )
      .build(),
  ],
  attachment: gearAttachmentToUnitOrLegend(),
}) satisfies GearCardDefinition;
