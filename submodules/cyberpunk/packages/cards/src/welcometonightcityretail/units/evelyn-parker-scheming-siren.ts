import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailEvelynParkerSchemingSiren = defineCyberpunkCard({
  id: "a3cc3d15-8e6a-4684-b2ca-c843b4a854e2",
  slug: "evelyn-parker-scheming-siren",
  rulesText:
    "{Attack} Draw 1. Then, if you have more ☆ (Street Cred) than a Rival, discard 1.\n(Units with power 0 don't steal Gigs.)",
  name: "Evelyn Parker — Scheming Siren",
  displayName: "Evelyn Parker — Scheming Siren",
  canonicalId: "evelyn-parker-scheming-siren",
  color: "blue",
  classifications: ["Doll"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "113",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/113.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: ["attack"],
  type: "unit",
  cost: 2,
  power: 0,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK Draw 1. Then, if you have more ☆ (Street Cred) than a Rival, discard 1.")
      .onAttack()
      .source(target.self())
      .effect(effect.draw({ player: "friendly", amount: 1 }))
      .effect(
        effect.discardFromHand({
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "gt",
              other: "rival",
            },
          ],
        }),
      )
      .build(),
  ],
  reminderText: ["Units with power 0 don't steal Gigs."],
}) satisfies UnitCardDefinition;
