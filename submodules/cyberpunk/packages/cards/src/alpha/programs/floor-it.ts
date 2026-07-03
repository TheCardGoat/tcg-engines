import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaFloorIt = defineCyberpunkCard({
  id: "ae8a7ca4-9682-4b52-aa00-2dcd4f2afecd",
  slug: "floor-it",
  rulesText:
    "Return a spent unit with cost 4 or less to its owner's hand. (Discard programs after they resolve.)",
  name: "Floor It",
  displayName: "Floor It",
  canonicalId: "floor-it",
  color: "blue",
  classifications: ["Plan", "Merc"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α023",
  artist: "DOFRESH",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a023.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  type: "program",
  cost: 3,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Return a spent unit with cost 4 or less to its owner's hand.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.returnToHand({
          target: target.card({
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
            maxCost: 4,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
          destinationOwner: "owner",
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
