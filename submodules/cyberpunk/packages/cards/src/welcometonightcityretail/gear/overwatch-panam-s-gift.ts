import type { GearCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailOverwatchPanamSGift = defineCyberpunkCard({
  id: "78ea68b3-1260-416b-9f88-d6be4586232b",
  canonicalId: "overwatch-panam-s-gift",
  slug: "overwatch-panam-s-gift",
  rulesText:
    "{Quick} 1 €$, {Spend} Discard 1. Defeat a spent rival Unit with cost equal to or less than the discarded card's cost.",
  name: "Overwatch — Panam's Gift",
  displayName: "Overwatch — Panam's Gift",
  color: "green",
  classifications: ["Weapon"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "093",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/093.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  keywords: ["quick"],
  attachment: {
    text: "Equip to a Unit or Legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
    },
  },
  abilities: [
    quickAbility({ text: "Quick", host: true }),
    {
      kind: "triggered",
      text: "1 €$, {Spend} Discard 1. Defeat a spent rival Unit with cost equal to or less than the discarded card's cost.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "discardedCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["hand"],
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
      costs: [
        {
          cost: "payEddies",
          amount: 1,
        },
        {
          cost: "spend",
          target: {
            selector: "host",
          },
        },
      ],
      effects: [
        {
          effect: "moveCard",
          target: {
            selector: "bound",
            id: "discardedCard",
          },
          destination: "trash",
        },
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            state: "spent",
            maxCostOf: {
              selector: "bound",
              id: "discardedCard",
            },
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
        },
      ],
    },
  ],
  type: "gear",
  cost: 4,
  power: 4,
}) satisfies GearCardDefinition;
