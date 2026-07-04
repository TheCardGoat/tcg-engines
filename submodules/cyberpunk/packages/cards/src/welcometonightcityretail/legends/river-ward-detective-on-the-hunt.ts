import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRiverWardDetectiveOnTheHunt = defineCyberpunkCard({
  id: "e64e2978-695b-4fc5-b17b-62c710a11c47",
  slug: "river-ward-detective-on-the-hunt",
  rulesText:
    "{Quick} {Spend} Play a Gear with cost 2 or less from your hand for free.\nWhen a friendly equipped Unit is defeated, search the top 2 cards of your deck and trash 1.",
  name: "River Ward — Detective on the Hunt",
  displayName: "River Ward — Detective on the Hunt",
  canonicalId: "river-ward-detective-on-the-hunt",
  color: "yellow",
  classifications: ["NCPD"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "039",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/039.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["quick"],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    quickAbility(),
    {
      kind: "triggered",
      text: "SPEND Play a Gear with cost 2 or less from your hand for free.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field", "legendArea"],
            cardTypes: ["unit", "legend"],
            face: "faceUp",
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
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "attachCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["hand"],
            cardTypes: ["gear"],
            maxCost: 2,
            selection: {
              mode: "choose",
              min: 1,
              max: 1,
            },
          },
          attachTo: {
            selector: "bound",
            id: "selectedUnit",
          },
          free: true,
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a friendly equipped Unit is defeated, search the top 2 cards of your deck and trash 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardDefeated",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["unit"],
            hasAttachedCards: true,
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "searchDeck",
          player: "friendly",
          lookCount: 2,
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["deck"],
          },
          select: {
            kind: "exact",
            amount: 1,
          },
          reveal: false,
          destination: "trash",
          remainder: {
            zone: "deckBottom",
          },
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
