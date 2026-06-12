import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaCorporateSurveillance = {
  id: "959ba373-3be2-4643-b3c6-fecdd5e384ce",
  externalId: "cyberpunk:corporate-surveillance",
  slug: "corporate-surveillance",
  name: "Corporate Surveillance",
  subname: null,
  displayName: "Corporate Surveillance",
  rulesText: "Spend a rival unit with cost 3 or less.",
  flavorText: null,
  color: "green",
  classifications: [],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α025",
  printings: [
    {
      id: "9dfb1a9b-6f0c-40d7-84e2-d8c684f13160",
      collectorNumber: "α025",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a025.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a025.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "John Liew",
    },
  ],
  selectedPrintingId: "9dfb1a9b-6f0c-40d7-84e2-d8c684f13160",
  artist: "John Liew",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a025.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a025.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Spend a rival unit with cost 3 or less.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.spend({
          target: target.card({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 3,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies AlphaCardDefinition;
