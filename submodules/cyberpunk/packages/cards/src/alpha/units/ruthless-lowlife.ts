import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaRuthlessLowlife = defineCyberpunkCard({
  id: "eae3fb96-aed6-4569-be40-d16150d8e1fe",
  slug: "ruthless-lowlife",
  rulesText:
    "When a rival steals one or more friendly gigs, if this unit is spent, the value of those gigs becomes 1.",
  name: "Ruthless Lowlife",
  displayName: "Ruthless Lowlife",
  canonicalId: "ruthless-lowlife",
  color: "red",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α008",
  artist: "Jeffrey Alan Love",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a008.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  type: "unit",
  cost: 2,
  power: 1,
  abilities: [
    AbilityBuilder.triggered()
      .text(
        "When a rival steals one or more friendly gigs, if this unit is spent, the value of those gigs becomes 1.",
      )
      .onGigStolen({
        player: "rival",
        target: target.gig({ controller: "friendly" }),
        minAmount: 1,
      })
      .source(target.self())
      .effect(
        effect.modifyGig({
          target: target.context("triggeredGigs"),
          operation: "set",
          value: 1,
          conditions: [condition.cardState({ target: target.self(), state: "spent" })],
        }),
      )
      .build(),
  ],
}) satisfies UnitCardDefinition;
