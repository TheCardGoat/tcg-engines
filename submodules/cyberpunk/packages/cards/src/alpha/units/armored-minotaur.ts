import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaArmoredMinotaur = {
  id: "3f52804a-9595-4115-a698-3b53f9b71227",
  externalId: "cyberpunk:armored-minotaur",
  slug: "armored-minotaur",
  name: "Armored Minotaur",
  subname: null,
  displayName: "Armored Minotaur",
  rulesText: "PLAY If you have 12+ Street Cred, defeat a rival unit with power 5 or less.",
  flavorText: null,
  color: "red",
  classifications: ["Arasaka", "Militech", "Drone"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α007",
  printings: [
    {
      id: "31ab0503-dd9a-46e3-ab21-31932376ed42",
      collectorNumber: "α007",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a007.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a007.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "CD PROJEKT RED",
    },
  ],
  selectedPrintingId: "31ab0503-dd9a-46e3-ab21-31932376ed42",
  artist: "CD PROJEKT RED",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a007.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a007.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["play"],
  keywords: [],
  type: "unit",
  cost: 6,
  power: 9,
  abilities: [
    AbilityBuilder.triggered()
      .text("PLAY If you have 12+ Street Cred, defeat a rival unit with power 5 or less.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.defeat({
          target: target.card({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxPower: 5,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
          conditions: [
            condition.streetCred({ controller: "friendly", comparison: "gte", value: 12 }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
