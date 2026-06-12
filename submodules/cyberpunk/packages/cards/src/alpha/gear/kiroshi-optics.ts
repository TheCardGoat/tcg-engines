import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaKiroshiOptics = {
  id: "bf1deeaa-316b-4000-bbe5-ec7663c934c3",
  externalId: "cyberpunk:kiroshi-optics",
  slug: "kiroshi-optics",
  name: "Kiroshi Optics",
  subname: null,
  displayName: "Kiroshi Optics",
  rulesText:
    "(Equip to a unit or face-up legend.) ATTACK Look at a friendly face-down legend without revealing it.",
  flavorText: null,
  color: "yellow",
  classifications: ["Cyberware", "Implant"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α026",
  printings: [
    {
      id: "70b37d1b-84a9-4b79-9772-84c14b37310a",
      collectorNumber: "α026",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a026.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a026.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "CD PROJEKT RED",
    },
  ],
  selectedPrintingId: "70b37d1b-84a9-4b79-9772-84c14b37310a",
  artist: "CD PROJEKT RED",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a026.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a026.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["attack"],
  keywords: [],
  type: "gear",
  cost: 1,
  power: 1,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK Look at a friendly face-down legend without revealing it.")
      .onAttack()
      .source(target.host())
      .effect(
        effect.lookAt({
          target: target.card({
            controller: "friendly",
            zones: ["legendArea"],
            cardTypes: ["legend"],
            face: "faceDown",
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
          revealToOpponent: false,
        }),
      )
      .build(),
  ],
  reminderText: [],
  attachment: gearAttachmentToUnitOrLegend(),
} satisfies AlphaCardDefinition;
