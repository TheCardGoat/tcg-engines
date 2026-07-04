import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailSwordwiseHuscle = defineCyberpunkCard({
  id: "3c4e7fcb-933d-4712-9ce7-6052a14f8e94",
  slug: "swordwise-huscle",
  rulesText: "{Attack} If this Unit has power 5+, draw 1.",
  name: "Swordwise Huscle",
  displayName: "Swordwise Huscle",
  canonicalId: "swordwise-huscle",
  color: "red",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "019",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/019.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["attack"],
  type: "unit",
  cost: 3,
  power: 3,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK If this Unit has power 5+, draw 1.")
      .onAttack()
      .source(target.self())
      .effect(
        effect.draw({
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "cardStat",
              target: target.self(),
              property: "power",
              comparison: "gte",
              value: 5,
            },
          ],
        }),
      )
      .build(),
  ],
}) satisfies UnitCardDefinition;
