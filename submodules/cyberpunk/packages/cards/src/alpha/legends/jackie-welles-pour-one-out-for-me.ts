import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaJackieWellesPourOneOutForMe = defineCyberpunkCard({
  id: "8ecb2fe3-9117-40be-9ffe-adbc5bbd2899",
  slug: "jackie-welles-pour-one-out-for-me",
  rulesText:
    "The first time you play a blue unit or blue gear each turn, you may increase a friendly gig by 2. Then, if it's at max value, draw a card.",
  subname: "Pour One Out For Me",
  name: "Jackie Welles",
  displayName: "Jackie Welles - Pour One Out For Me",
  canonicalId: "jackie-welles-pour-one-out-for-me",
  color: "blue",
  classifications: ["Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α002",
  artist: "Envar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a002.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
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
}) satisfies LegendCardDefinition;
