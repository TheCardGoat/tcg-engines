import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaViktorVektorSitDownAndRelax = {
  id: "d759e31e-12fd-4e44-92ad-7fd2535d43f5",
  externalId: "cyberpunk:viktor-vektor-sit-down-and-relax",
  slug: "viktor-vektor-sit-down-and-relax",
  name: "Viktor Vektor",
  subname: "Sit Down and Relax",
  displayName: "Viktor Vektor - Sit Down and Relax",
  rulesText:
    "CALL Search the top 5 cards of your deck for up to 2 gear that costs 2 or less each. Reveal them and add them to your hand. (Place the other cards on the bottom of your deck in a random order.)",
  flavorText: null,
  color: "yellow",
  classifications: ["Ripperdoc", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α006",
  printings: [
    {
      id: "ced3a1c6-3e58-4717-a7d9-e4c1d0f2460c",
      collectorNumber: "α006",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a006.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a006.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Envar",
    },
  ],
  selectedPrintingId: "ced3a1c6-3e58-4717-a7d9-e4c1d0f2460c",
  artist: "Envar",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a006.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a006.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: [],
  type: "legend",
  cost: null,
  power: 0,
  abilities: [
    AbilityBuilder.triggered()
      .text(
        "CALL Search the top 5 cards of your deck for up to 2 gear that costs 2 or less each. Reveal them and add them to your hand. (Place the other cards on the bottom of your deck in a random order.)",
      )
      .onCall()
      .source(target.self())
      .effect(
        effect.searchDeck({
          player: "friendly",
          lookCount: 5,
          target: target.card({
            controller: "friendly",
            zones: ["deck"],
            cardTypes: ["gear"],
            maxCost: 2,
          }),
          select: {
            kind: "upTo",
            max: 2,
          },
          reveal: true,
          destination: "hand",
          remainder: {
            zone: "deckBottom",
            order: "random",
          },
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
