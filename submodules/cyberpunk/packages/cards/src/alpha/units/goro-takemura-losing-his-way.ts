import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaGoroTakemuraLosingHisWay = {
  id: "963f4fd2-9a58-4b50-96f9-d947d4105b56",
  externalId: "cyberpunk:goro-takemura-losing-his-way",
  slug: "goro-takemura-losing-his-way",
  name: "Goro Takemura",
  subname: "Losing His Way",
  displayName: "Goro Takemura - Losing His Way",
  rulesText:
    "This unit has +1 power during your turn for each face-up legend in your legends area.",
  flavorText: null,
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α018",
  printings: [
    {
      id: "4a40ce11-128b-4560-9d46-294c859475ff",
      collectorNumber: "α018",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a018.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a018.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Ilya Kuvshinov",
    },
  ],
  selectedPrintingId: "4a40ce11-128b-4560-9d46-294c859475ff",
  artist: "Ilya Kuvshinov",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a018.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a018.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    AbilityBuilder.static()
      .text("This unit has +1 power during your turn for each face-up legend in your legends area.")
      .effect(
        effect.modifyPower({
          target: target.self(),
          value: {
            type: "perCount",
            multiplier: 1,
            target: target.card({
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              face: "faceUp",
            }),
          },
          duration: "continuous",
          conditions: [condition.turn({ player: "friendly" })],
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
