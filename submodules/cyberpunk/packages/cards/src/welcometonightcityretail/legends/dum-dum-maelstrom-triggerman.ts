import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailDumDumMaelstromTriggerman = defineCyberpunkCard({
  id: "3b3f941d-aa58-4337-99dc-4af3fd3ccd47",
  slug: "dum-dum-maelstrom-triggerman",
  rulesText:
    "{Call} You may defeat a friendly Gear. If you do, draw 2. Otherwise, draw 1.\n{Quick} 1 €$, {Spend} Give a friendly Unit +1 power this turn for each of its equipped Gear.",
  name: "Dum Dum — Maelstrom Triggerman",
  displayName: "Dum Dum — Maelstrom Triggerman",
  canonicalId: "dum-dum-maelstrom-triggerman",
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "036",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/036.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  keywords: ["quick"],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    quickAbility(),
    {
      kind: "triggered",
      text: "CALL You may defeat a friendly Gear. If you do, draw 2. Otherwise, draw 1.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "defeat",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["field"],
              cardTypes: ["gear"],
            },
            optional: true,
          },
          ifEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 2,
            },
          ],
          elseEffects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "1 €$, SPEND Give a friendly Unit +1 power this turn for each of its equipped Gear.",
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
          effect: "modifyPower",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          value: {
            type: "perCount",
            multiplier: 1,
            target: {
              selector: "card",
              controller: "friendly",
              cardTypes: ["gear"],
              attachedTo: {
                selector: "bound",
                id: "selectedUnit",
              },
            },
          },
          duration: "turn",
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
