import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailNocturneOp55N1 = defineCyberpunkCard({
  id: "e4af26f0-e25d-4e30-8bac-6701f54f3e97",
  canonicalId: "nocturne-op55-n1",
  slug: "nocturne-op55-n1",
  name: "Nocturne OP55 N1",
  displayName: "Nocturne OP55 N1",
  rulesText:
    "If your fixer area is empty, play this Program for 1 €$. Choose one effect.\nDraw 2. // A Unit can't attack until your next turn. // A friendly Legend may use {Go Solo} for -2 €$ this turn, to a minimum of 1 €$.",
  color: "blue",
  classifications: ["Arasaka", "Plan"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "134",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/134.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Choose one effect. Draw 2. // A Unit can't attack until your next turn. // A friendly Legend may use Go Solo for -2 €$ this turn, to a minimum of 1 €$.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "chooseEffect",
          options: [
            {
              id: "draw",
              label: "Draw 2",
              effects: [
                {
                  effect: "draw",
                  player: "friendly",
                  amount: 2,
                },
              ],
            },
            {
              id: "cant-attack",
              label: "A Unit can't attack until your next turn",
              effects: [
                {
                  effect: "grantRule",
                  target: {
                    selector: "card",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    selection: {
                      mode: "choose",
                      min: 1,
                      max: 1,
                    },
                  },
                  rule: "cantAttack",
                  duration: "untilSourceNextTurn",
                },
              ],
            },
            {
              id: "go-solo",
              label: "A friendly Legend may use Go Solo for -2 €$ this turn, to a minimum of 1 €$",
              effects: [
                {
                  effect: "grantCostModifier",
                  player: "friendly",
                  appliesTo: {
                    selector: "card",
                    controller: "friendly",
                    zones: ["legendArea"],
                    cardTypes: ["legend"],
                    keywords: ["goSolo"],
                  },
                  modifier: {
                    reducer: "flat",
                    amount: 2,
                    min: 1,
                  },
                  duration: "turn",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 3,
  costModifier: {
    reducer: "replace",
    amount: 1,
    conditions: [
      {
        condition: "fixerAreaCount",
        controller: "friendly",
        comparison: "eq",
        value: 0,
      },
    ],
  },
}) satisfies ProgramCardDefinition;
