import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaDyingNightVSPistol = {
  id: "fe99da63-8c6b-412b-b4e6-e24ce0de34c1",
  externalId: "cyberpunk:dying-night-v-s-pistol",
  slug: "dying-night-v-s-pistol",
  name: "Dying Night",
  subname: "V's Pistol",
  displayName: "Dying Night - V's Pistol",
  rulesText:
    "(Equip to a unit or face-up legend.) ATTACK If you have 7+ Street Cred, defeat a rival gear card that costs 2 or less.",
  flavorText: null,
  color: "blue",
  classifications: ["Weapon", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α022",
  printings: [
    {
      id: "5f7f3400-87c7-4794-a7b9-7e74b18ed630",
      collectorNumber: "α022",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a022.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a022.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Ivan Shavrin",
    },
  ],
  selectedPrintingId: "5f7f3400-87c7-4794-a7b9-7e74b18ed630",
  artist: "Ivan Shavrin",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a022.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a022.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  timingTriggers: ["attack"],
  keywords: [],
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
  reminderText: [],
  attachment: gearAttachmentToUnitOrLegend(),
} satisfies AlphaCardDefinition;
