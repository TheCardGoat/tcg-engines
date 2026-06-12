import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaJackieWellesPourOneOutForMe = {
  id: "8ecb2fe3-9117-40be-9ffe-adbc5bbd2899",
  externalId: "cyberpunk:jackie-welles-pour-one-out-for-me",
  slug: "jackie-welles-pour-one-out-for-me",
  name: "Jackie Welles",
  subname: "Pour One Out For Me",
  displayName: "Jackie Welles - Pour One Out For Me",
  rulesText:
    "The first time you play a blue unit or blue gear each turn, you may increase a friendly gig by 2. Then, if it's at max value, draw a card.",
  flavorText: null,
  color: "blue",
  classifications: ["Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α002",
  printings: [
    {
      id: "e60cdc66-c3e9-46a9-9be4-45424fd65c71",
      collectorNumber: "α002",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a002.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a002.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Envar",
    },
  ],
  selectedPrintingId: "e60cdc66-c3e9-46a9-9be4-45424fd65c71",
  artist: "Envar",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a002.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a002.webp",
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
        "The first time you play a blue unit or blue gear each turn, you may increase a friendly gig by 2. Then, if it's at max value, draw a card.",
      )
      .source(target.self())
      .onCardPlayed({
        player: "friendly",
        target: target.card({
          controller: "friendly",
          cardTypes: ["unit", "gear"],
          colors: ["blue"],
        }),
      })
      .limit("firstTimeEachTurn")
      .bind("selectedGig", target.gig({ controller: "friendly" }))
      .effect(
        effect.modifyGig({
          target: target.bound("selectedGig"),
          operation: "increase",
          value: 2,
          optional: true,
        }),
      )
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
          conditions: [
            condition.targetValue({
              target: target.bound("selectedGig"),
              property: "gigValue",
              comparison: "eq",
              value: "max",
            }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
