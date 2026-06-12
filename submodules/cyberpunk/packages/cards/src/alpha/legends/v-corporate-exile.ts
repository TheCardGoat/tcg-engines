import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, target } from "../../helpers/builders/index.ts";

export const alphaVCorporateExile = {
  id: "1c73efa6-4685-48e5-9064-11f31c8e6357",
  externalId: "cyberpunk:v-corporate-exile",
  slug: "v-corporate-exile",
  name: "V",
  subname: "Corporate Exile",
  displayName: "V - Corporate Exile",
  rulesText: "GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)",
  flavorText: null,
  color: "blue",
  classifications: ["Merc", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α003",
  printings: [
    {
      id: "95588c1b-a375-4a05-a1e8-7cf3b215a180",
      collectorNumber: "α003",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a003.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a003.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Envar",
    },
  ],
  selectedPrintingId: "95588c1b-a375-4a05-a1e8-7cf3b215a180",
  artist: "Envar",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a003.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a003.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: ["goSolo"],
  type: "legend",
  cost: 5,
  power: 8,
  abilities: [
    AbilityBuilder.keyword()
      .keyword("goSolo")
      .text("GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)")
      .source(target.self())
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
