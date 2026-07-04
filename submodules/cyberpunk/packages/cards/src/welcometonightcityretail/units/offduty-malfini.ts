import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailOffdutyMalfini = defineCyberpunkCard({
  id: "3ce6b982-7bba-46f1-8832-8867ec3588d4",
  slug: "offduty-malfini",
  rulesText: "{Play} Spend this Unit and a rival Unit.",
  name: "Offduty Malfini",
  displayName: "Offduty Malfini",
  canonicalId: "offduty-malfini",
  color: "yellow",
  classifications: ["Ganger", "Voodoo Boys"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "051",
  artist: "Bernard Kowalczuk",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/051.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    AbilityBuilder.triggered()
      .text("PLAY Spend this Unit and a rival Unit.")
      .onPlay()
      .source(target.self())
      .effect(effect.spend({ target: target.self() }))
      .effect(
        effect.spend({
          target: target.card({
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
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
}) satisfies UnitCardDefinition;
