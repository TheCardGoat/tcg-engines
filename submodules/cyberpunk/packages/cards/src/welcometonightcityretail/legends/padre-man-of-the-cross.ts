import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailPadreManOfTheCross = defineCyberpunkCard({
  id: "501a3796-9983-400f-86e4-97ffac5d5451",
  canonicalId: "padre-man-of-the-cross",
  slug: "padre-man-of-the-cross",
  subname: "Man of the Cross",
  name: "Padre",
  displayName: "Padre: Man of the Cross",
  rulesText:
    "{Call} Choose one effect.\nSpend a rival Unit. // Draw 1.\n{Spend} Set a player's Gig to the same value as another player's Gig.",
  color: "green",
  classifications: ["Fixer", "Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "074",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/074.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  abilities: [
    {
      kind: "triggered",
      text: "CALL Choose one effect. Spend a rival Unit. // Draw 1.",
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
              id: "spend",
              label: "Spend a rival Unit",
              effects: [
                {
                  effect: "spend",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    state: "ready",
                    selection: {
                      mode: "choose",
                      min: 1,
                      max: 1,
                    },
                  },
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
      text: "SPEND Set a player's Gig to the same value as another player's Gig.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGigs",
          target: {
            selector: "gig",
            amount: 2,
            selection: {
              mode: "choose",
              min: 2,
              max: 2,
              pairConstraint: "gig-copy-between-players",
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
          effect: "copyGigValue",
          source: {
            selector: "bound",
            id: "selectedGigs",
            index: 0,
          },
          target: {
            selector: "bound",
            id: "selectedGigs",
            index: 1,
          },
        },
      ],
    },
  ],
  type: "legend",
}) satisfies LegendCardDefinition;
