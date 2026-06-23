import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaRuthlessLowlife = {
  id: "eae3fb96-aed6-4569-be40-d16150d8e1fe",
  externalId: "cyberpunk:ruthless-lowlife",
  slug: "ruthless-lowlife",
  name: "Ruthless Lowlife",
  displayName: "Ruthless Lowlife",
  rulesText:
    "When a rival steals one or more friendly gigs, if this unit is spent, the value of those gigs becomes 1.",
  color: "red",
  classifications: ["Arasaka", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α008",
  printings: [
    {
      id: "3281fd30-51ef-4306-ab20-7819eb1b339d",
      collectorNumber: "α008",
      setCode: "alpha",
      rarity: null,
    },
  ],
  selectedPrintingId: "3281fd30-51ef-4306-ab20-7819eb1b339d",
  artist: "Jeffrey Alan Love",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a008.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  timingTriggers: [],
  keywords: [],
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
  reminderText: [],
} satisfies AlphaCardDefinition;
