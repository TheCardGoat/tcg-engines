import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaYorinobuArasakaEmbracingDestruction = defineCyberpunkCard({
  id: "23fc1451-7374-4c21-87ae-bb05d49f2836",
  slug: "yorinobu-arasaka-embracing-destruction",
  rulesText:
    "The first time a friendly Arasaka unit attacks each turn, draw a card. Then, if you have less than 20 * (Street Cred), discard 1 card from your hand to your trash.",
  subname: "Embracing Destruction",
  name: "Yorinobu Arasaka",
  displayName: "Yorinobu Arasaka - Embracing Destruction",
  canonicalId: "yorinobu-arasaka-embracing-destruction",
  color: "red",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α001",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a001.webp",
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
}) satisfies LegendCardDefinition;
