import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaIndustrialAssembly = defineCyberpunkCard({
  id: "48f31579-a32b-4c58-923c-93a2aa3b780c",
  slug: "industrial-assembly",
  rulesText:
    "Increase a friendly gig by 4. Then, if you have 7+ * (Street Cred), draw a card. (Discard programs after they resolve.)",
  name: "Industrial Assembly",
  displayName: "Industrial Assembly",
  canonicalId: "industrial-assembly",
  color: "red",
  classifications: ["Plan", "Arasaka"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α021",
  artist: "Alexander Dudar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a021.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["play"],
  type: "program",
  cost: 2,
  power: null,
  abilities: [
    AbilityBuilder.triggered()
      .text("Increase a friendly gig by 4. Then, if you have 7+ Street Cred, draw a card.")
      .onPlay()
      .source(target.self())
      .effect(
        effect.modifyGig({
          target: target.gig({
            controller: "friendly",
            selection: { mode: "choose", min: 1, max: 1 },
          }),
          operation: "increase",
          value: 4,
        }),
      )
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
          conditions: [
            condition.streetCred({ controller: "friendly", comparison: "gte", value: 7 }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
