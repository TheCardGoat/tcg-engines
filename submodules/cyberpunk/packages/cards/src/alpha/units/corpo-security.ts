import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder } from "../../helpers/builders/index.ts";
import { effect } from "../../helpers/builders/index.ts";
import { target } from "../../helpers/builders/index.ts";

export const alphaCorpoSecurity = {
  id: "b6652036-bbe2-407d-9c33-cce1147dbb7e",
  externalId: "cyberpunk:corpo-security",
  slug: "corpo-security",
  name: "Corpo Security",
  subname: null,
  displayName: "Corpo Security",
  rulesText:
    "This unit can't attack. BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
  flavorText: null,
  color: "green",
  classifications: ["Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α016",
  printings: [
    {
      id: "0e6c2994-b434-4083-b446-622bdbdc9268",
      collectorNumber: "α016",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a016.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a016.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Daniel Valaisis",
    },
  ],
  selectedPrintingId: "0e6c2994-b434-4083-b446-622bdbdc9268",
  artist: "Daniel Valaisis",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a016.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a016.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: [],
  keywords: ["blocker"],
  type: "unit",
  cost: 2,
  power: 2,
  abilities: [
    AbilityBuilder.keyword()
      .keyword("blocker")
      .text(
        "BLOCKER (When a rival unit attacks, you may spend this unit to redirect the attack to it.)",
      )
      .source(target.self())
      .build(),
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
  reminderText: [],
} satisfies AlphaCardDefinition;
