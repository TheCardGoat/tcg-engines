import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaYorinobuArasakaEmbracingDestruction = {
  id: "23fc1451-7374-4c21-87ae-bb05d49f2836",
  externalId: "cyberpunk:yorinobu-arasaka-embracing-destruction",
  slug: "yorinobu-arasaka-embracing-destruction",
  name: "Yorinobu Arasaka",
  subname: "Embracing Destruction",
  displayName: "Yorinobu Arasaka - Embracing Destruction",
  rulesText:
    "The first time a friendly Arasaka unit attacks each turn, draw a card. Then, if you have less than 20 Street Cred, discard 1 card from your hand to your trash.",
  flavorText: null,
  color: "red",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α001",
  printings: [
    {
      id: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6",
      collectorNumber: "α001",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a001.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a001.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "ADIA",
    },
    {
      id: "0df78ba5-116a-4794-b975-7bbf85b95d3b",
      collectorNumber: "α031",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a031.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a031.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Vincenzo Riccardi",
    },
  ],
  selectedPrintingId: "eb37f60f-a376-4412-a4cd-7ce5c1b088f6",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a001.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a001.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
  type: "legend",
  cost: null,
  power: 0,
  abilities: [
    AbilityBuilder.triggered()
      .text(
        "The first time a friendly Arasaka unit attacks each turn, draw a card. Then, if you have less than 20 Street Cred, discard 1 card from your hand to your trash.",
      )
      .onCardAttacks({
        player: "friendly",
        target: target.card({
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          classifications: ["Arasaka"],
        }),
      })
      .source(target.self())
      .limit("firstTimeEachTurn")
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
        }),
      )
      .effect(
        effect.discardFromHand({
          player: "friendly",
          amount: 1,
          conditions: [
            condition.streetCred({ controller: "friendly", comparison: "lt", value: 20 }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
