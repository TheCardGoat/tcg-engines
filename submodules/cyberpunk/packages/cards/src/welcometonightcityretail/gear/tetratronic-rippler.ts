import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailTetratronicRippler = defineCyberpunkCard({
  id: "39665784-d2f1-43e8-a958-894bac716d71",
  canonicalId: "tetratronic-rippler",
  slug: "tetratronic-rippler",
  name: "Tetratronic Rippler",
  displayName: "Tetratronic Rippler",
  rulesText:
    "(Equip to a friendly Unit or face-up Legend.)\nWhen this Unit or Legend is spent, search the top card of your deck. You may trash it. (Otherwise, keep it on the top of your deck.)",
  color: "blue",
  classifications: ["Cyberware"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "130",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/130.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit or Legend is spent, search the top card of your deck. You may trash it.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardSpent",
          player: "friendly",
          target: {
            selector: "host",
          },
        },
      },
      source: {
        selector: "host",
      },
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 1,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
          },
          select: {
            kind: "upTo",
            max: 1,
          },
          reveal: false,
          destination: "trash",
          remainder: {
            zone: "deckTop",
          },
        },
      ],
    },
  ],
  reminderText: ["Otherwise, keep it on the top of your deck."],
  type: "gear",
  cost: 1,
  power: 1,
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
