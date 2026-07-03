import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";
import { gearAttachmentToUnitOrLegend } from "../../define.ts";

export const alphaKiroshiOptics = defineCyberpunkCard({
  id: "bf1deeaa-316b-4000-bbe5-ec7663c934c3",
  slug: "kiroshi-optics",
  rulesText:
    "(Equip to a unit or face-up legend.) ATTACK Look at a friendly face-down legend without revealing it.",
  name: "Kiroshi Optics",
  displayName: "Kiroshi Optics",
  canonicalId: "kiroshi-optics",
  color: "yellow",
  classifications: ["Cyberware", "Implant"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α026",
  artist: "CD PROJEKT RED",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a026.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 1,
  timingTriggers: ["attack"],
  type: "gear",
  cost: 1,
  power: 1,
  abilities: [
    AbilityBuilder.triggered()
      .text("ATTACK Look at a friendly face-down legend without revealing it.")
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
  attachment: gearAttachmentToUnitOrLegend(),
}) satisfies GearCardDefinition;
