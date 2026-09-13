import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailDexterDeshawnOffTheGrid = defineCyberpunkCard({
  id: "91df478a-91d5-4d42-a624-4c20ec61121c",
  canonicalId: "dexter-deshawn-off-the-grid",
  slug: "dexter-deshawn-off-the-grid",
  subname: "Off the Grid",
  name: "Dexter DeShawn",
  displayName: "Dexter DeShawn: Off the Grid",
  rulesText:
    "{Call} Choose one effect.\nGive a friendly Unit +2 power this turn. // Draw 1.\n{Spend}: Increase a Gig by up to 2.",
  color: "red",
  classifications: ["Fixer"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "002",
  artist: "Envar",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/002.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  abilities: [
    {
      kind: "triggered",
      text: "CALL Choose one effect. Give a friendly Unit +2 power this turn. // Draw 1.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "chooseEffect",
          options: [
            {
              id: "buff",
              label: "Give a friendly Unit +2 power this turn",
              effects: [
                {
                  effect: "modifyPower",
                  target: {
                    selector: "card",
                    controller: "friendly",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    selection: {
                      mode: "choose",
                      min: 1,
                      max: 1,
                    },
                  },
                  value: 2,
                  duration: "turn",
                },
              ],
            },
            {
              id: "draw",
              label: "Draw 1",
              effects: [
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
    },
    {
      kind: "triggered",
      text: "SPEND: Increase a Gig by up to 2.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            amount: 1,
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
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 2,
          direction: "increase",
          chooseUpTo: true,
        },
      ],
    },
  ],
  type: "legend",
}) satisfies LegendCardDefinition;
