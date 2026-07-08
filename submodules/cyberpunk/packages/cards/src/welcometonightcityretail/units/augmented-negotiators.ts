import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { blockerAbility } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailAugmentedNegotiators = defineCyberpunkCard({
  id: "ce45cb9d-430a-4ccf-bb4b-acf0b76120e0",
  canonicalId: "augmented-negotiators",
  slug: "augmented-negotiators",
  rulesText:
    "{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)\nWhen this Unit uses {Blocker}, a Rival discards 1.",
  name: "Augmented Negotiators",
  displayName: "Augmented Negotiators",
  color: "yellow",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "043",
  artist: "Bernard Kowalczuk",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/043.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  keywords: ["blocker"],
  abilities: [
    blockerAbility({
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
    }),
    {
      kind: "triggered",
      text: "When this Unit uses Blocker, a Rival discards 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "blockerActivated",
          player: "friendly",
          target: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 2,
}) satisfies UnitCardDefinition;
