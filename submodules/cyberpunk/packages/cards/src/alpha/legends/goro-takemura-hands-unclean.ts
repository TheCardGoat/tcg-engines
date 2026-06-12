import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, target } from "../../helpers/builders/index.ts";

export const alphaGoroTakemuraHandsUnclean = {
  id: "d2254af5-7235-4691-8f90-69368df24361",
  externalId: "cyberpunk:goro-takemura-hands-unclean",
  slug: "goro-takemura-hands-unclean",
  name: "Goro Takemura",
  subname: "Hands Unclean",
  displayName: "Goro Takemura - Hands Unclean",
  rulesText:
    "GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.) BLOCKER (When a rival units attacks, you may spend this unit to redirect the attack to this unit.)",
  flavorText: null,
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α004",
  printings: [
    {
      id: "655c0160-6ac2-4630-9318-7aeffbabedad",
      collectorNumber: "α004",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a004.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a004.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Bad Moon Studio",
    },
    {
      id: "6478bab9-54f1-47cc-9090-95b868b917e2",
      collectorNumber: "α030",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a030.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a030.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Vincenzo Riccardi",
    },
  ],
  selectedPrintingId: "655c0160-6ac2-4630-9318-7aeffbabedad",
  artist: "Bad Moon Studio",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a004.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a004.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["goSolo", "blocker"],
  type: "legend",
  cost: 5,
  power: 7,
  abilities: [
    AbilityBuilder.keyword()
      .keyword("goSolo")
      .text("GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)")
      .source(target.self())
      .build(),
    AbilityBuilder.keyword()
      .keyword("blocker")
      .text(
        "BLOCKER (When a rival units attacks, you may spend this unit to redirect the attack to this unit.)",
      )
      .source(target.self())
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
