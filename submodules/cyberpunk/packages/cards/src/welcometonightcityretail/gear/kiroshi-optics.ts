import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailKiroshiOptics = defineCyberpunkCard({
  id: "654f2289-5d75-4f8b-bd35-702031fbb214",
  slug: "kiroshi-optics",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\n{Attack} Look at a friendly face-down Legend. (Don't reveal it.)",
  name: "Kiroshi Optics",
  displayName: "Kiroshi Optics",
  canonicalId: "kiroshi-optics",
  color: "yellow",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "061",
  artist: "CD Projekt Red",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/061.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["attack"],
  type: "gear",
  cost: 1,
  power: 1,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK Look at a friendly face-down Legend. (Don't reveal it.)")
      .onAttack()
      .source(target.host())
      .effect(
        effect.lookAt({
          target: target.card({
            controller: "friendly",
            zones: ["legendArea"],
            cardTypes: ["legend"],
            face: "faceDown",
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          }),
          revealToOpponent: false,
        }),
      )
      .build(),
  ],
  attachment: {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  },
}) satisfies GearCardDefinition;
