import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaFloorIt = {
  id: "ae8a7ca4-9682-4b52-aa00-2dcd4f2afecd",
  externalId: "cyberpunk:floor-it",
  slug: "floor-it",
  name: "Floor It",
  subname: null,
  displayName: "Floor It",
  rulesText: "Return a spent unit with cost 4 or less to its owner's hand.",
  flavorText: null,
  color: "blue",
  classifications: ["Plan", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α023",
  printings: [
    {
      id: "40d6acaa-ab6a-4ed9-895c-1e330b7fa4d4",
      collectorNumber: "α023",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a023.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a023.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "DOFRESH",
    },
  ],
  selectedPrintingId: "40d6acaa-ab6a-4ed9-895c-1e330b7fa4d4",
  artist: "DOFRESH",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a023.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a023.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  keywords: [],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Return a spent unit with cost 4 or less to its owner's hand.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.returnToHand({
          target: target.card({
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
            maxCost: 4,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
          destinationOwner: "owner",
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
} satisfies AlphaCardDefinition;
