import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const alphaCorporateSurveillance = defineCyberpunkCard({
  id: "959ba373-3be2-4643-b3c6-fecdd5e384ce",
  slug: "corporate-surveillance",
  rulesText: "Spend a rival unit with cost 3 or less. (Discard programs after they resolve.)",
  name: "Corporate Surveillance",
  displayName: "Corporate Surveillance",
  canonicalId: "corporate-surveillance",
  color: "green",
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α025",
  artist: "John Liew",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a025.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Spend a rival unit with cost 3 or less.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.spend({
          target: target.card({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 3,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
