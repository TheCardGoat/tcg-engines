import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaViktorVektorSitDownAndRelax = defineCyberpunkCard({
  id: "d759e31e-12fd-4e44-92ad-7fd2535d43f5",
  slug: "viktor-vektor-sit-down-and-relax",
  rulesText:
    "FLIP Search the top 5 cards of your deck for up yo 2 gear that costs 2 or less each. Reveal them and add them to your hand. (Place the other cards on the bottom of your deck in a random order.)",
  subname: "Sit Down and Relax",
  name: "Viktor Vektor",
  displayName: "Viktor Vektor - Sit Down and Relax",
  canonicalId: "viktor-vektor-sit-down-and-relax",
  color: "yellow",
  classifications: ["Ripperdoc", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α006",
  artist: "Envar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a006.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
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
}) satisfies LegendCardDefinition;
