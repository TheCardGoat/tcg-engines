import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailWakakoOkadaPeaceAndHarmony = defineCyberpunkCard({
  id: "99f5e311-8dfd-42a9-abd0-2e50ac68679e",
  canonicalId: "wakako-okada-peace-and-harmony",
  slug: "wakako-okada-peace-and-harmony",
  subname: "Peace and Harmony",
  name: "Wakako Okada",
  displayName: "Wakako Okada: Peace and Harmony",
  rulesText:
    "{Call} Choose one effect.\nGive a rival Unit -2 power this turn. // Draw 1.\n{Spend}: Decrease a Gig by up to 2.",
  color: "blue",
  classifications: ["Fixer", "Tyger Claws"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "110",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/110.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  abilities: [
    {
      kind: "triggered",
      text: "{Call} Choose one effect. Give a rival Unit -2 power this turn. // Draw 1.",
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
              id: "weaken",
              label: "Give a rival Unit -2 power this turn",
              effects: [
                {
                  effect: "modifyPower",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    selection: {
                      mode: "choose",
                      min: 1,
                      max: 1,
                    },
                  },
                  value: -2,
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
      text: "{Spend}: Decrease a Gig by up to 2.",
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
          direction: "decrease",
          chooseUpTo: true,
        },
      ],
    },
  ],
  type: "legend",
}) satisfies LegendCardDefinition;
