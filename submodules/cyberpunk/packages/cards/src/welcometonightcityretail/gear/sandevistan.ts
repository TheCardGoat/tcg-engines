import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const welcomeToNightCityRetailSandevistan = defineCyberpunkCard({
  id: "55153b49-c3a7-4208-a47b-0a91fa7e3b5c",
  slug: "sandevistan",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nAt the end of your turn, ready this Unit or Legend.",
  name: "Sandevistan",
  displayName: "Sandevistan",
  canonicalId: "sandevistan",
  color: "green",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "095",
  artist: "CD Projekt Red",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/095.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  type: "gear",
  cost: 3,
  power: 2,
  abilities: [
    AbilityBuilder.triggered()
      .text("At the end of your turn, ready this Unit or Legend.")
      .onTurnEnded({ player: "friendly" })
      .source(target.host())
      .effect(effect.ready({ target: target.host() }))
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
