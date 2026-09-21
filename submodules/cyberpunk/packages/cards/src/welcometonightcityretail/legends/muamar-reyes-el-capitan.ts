import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMuamarReyesElCapitan = defineCyberpunkCard({
  id: "fc516d53-5fd8-43dd-8349-9e60f0606efa",
  canonicalId: "muamar-reyes-el-capitan",
  slug: "muamar-reyes-el-capitan",
  subname: "El Capitán",
  name: "Muamar Reyes",
  displayName: "Muamar Reyes: El Capitán",
  rulesText:
    "{Call} Choose one effect.\nA friendly Unit can't be defeated in a fight this turn. // Draw 1.\n{Spend} Adjust a Gig by 1.",
  color: "yellow",
  classifications: ["Fixer"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "038",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/038.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  abilities: [
    {
      kind: "triggered",
      text: "CALL Choose one effect. A friendly Unit can't be defeated in a fight this turn. // Draw 1.",
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
              id: "protect",
              label: "A friendly Unit can't be defeated in a fight this turn",
              effects: [
                {
                  effect: "grantRule",
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
                  rule: "cantBeDefeatedInFight",
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
      text: "SPEND Adjust a Gig by 1.",
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
          maxAmount: 1,
          direction: "either",
        },
      ],
    },
  ],
  type: "legend",
}) satisfies LegendCardDefinition;
