import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaSatoriSwordOfSaburo = {
  id: "07be92a9-d9c9-43f6-a497-4c0aa20c46d1",
  externalId: "cyberpunk:satori-sword-of-saburo",
  slug: "satori-sword-of-saburo",
  name: "Satori",
  subname: "Sword of Saburo",
  displayName: "Satori - Sword of Saburo",
  rulesText:
    "(Equip to a unit or face-up legend.) ATTACK If this unit wins a fight against a rival unit, draw a card.",
  flavorText: null,
  color: "red",
  classifications: ["Weapon", "Arasaka"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α020",
  printings: [
    {
      id: "d0cd01e9-2bb5-4cd6-abdf-19f1004a47c9",
      collectorNumber: "α020",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a020.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a020.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Ivan Shavrin",
    },
  ],
  selectedPrintingId: "d0cd01e9-2bb5-4cd6-abdf-19f1004a47c9",
  artist: "Ivan Shavrin",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a020.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a020.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "gear",
  cost: 2,
  power: 1,
  abilities: [
    AbilityBuilder.triggered()
      .text("If this unit wins a fight against a rival unit, draw a card.")
      .onFightResolved({
        player: "friendly",
        result: "attackerWins",
        attacker: target.host(),
        defender: target.card({ cardTypes: ["unit"] }),
      })
      .source(target.host())
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
        }),
      )
      .build(),
  ],
  reminderText: [],
  attachment: gearAttachmentToUnitOrLegend(),
} satisfies AlphaCardDefinition;
