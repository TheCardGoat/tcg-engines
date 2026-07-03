import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailGoroTakemuraVengefulBodyguard = defineCyberpunkCard({
  id: "424c9c0f-cc01-40ec-8404-75957985c7f8",
  slug: "goro-takemura-vengeful-bodyguard",
  rulesText:
    "{Quick} 1 €$, {Spend} Give a friendly Unit with cost 4 or less {Blocker} this turn. If you control a value-pair of Gigs, also give it +1 power this turn.\nWhen a friendly Unit uses {Blocker}, you may discard 1. If you do, draw 1.",
  name: "Goro Takemura — Vengeful Bodyguard",
  displayName: "Goro Takemura — Vengeful Bodyguard",
  canonicalId: "goro-takemura-vengeful-bodyguard",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "071",
  artist: "Daniel Valaisis",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/071.webp",
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
      text: "1 €$, SPEND Give a friendly Unit with cost 4 or less BLOCKER this turn. If you control a value-pair of Gigs, also give it +1 power this turn.",
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
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 4,
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
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "blocker",
          duration: "turn",
        },
        {
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: 1,
          duration: "turn",
          conditions: [
            {
              condition: "hasGigPair",
              controller: "friendly",
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a friendly Unit uses BLOCKER, you may discard 1. If you do, draw 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "blockerActivated",
          player: "friendly",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "discardFromHand",
            player: "friendly",
            amount: 1,
            optional: true,
          },
          ifEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
            },
          ],
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
