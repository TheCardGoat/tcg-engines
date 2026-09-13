import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailPacificaNetrunner = defineCyberpunkCard({
  id: "c4ef7be4-4817-4fae-9016-582e999d4996",
  canonicalId: "pacifica-netrunner",
  slug: "pacifica-netrunner",
  name: "Pacifica Netrunner",
  displayName: "Pacifica Netrunner",
  rulesText:
    "{Play} If your ☆ (Street Cred) is an even number, a rival Unit can't ready until your next turn.",
  color: "green",
  classifications: ["Netrunner"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "084",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/084.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Play If your ☆ (Street Cred) is an even number, a rival Unit can't ready until your next turn.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedUnit",
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
        },
      ],
      effects: [
        {
          effect: "spend",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          conditions: [
            {
              condition: "streetCredParity",
              controller: "friendly",
              parity: "even",
            },
          ],
        },
        {
          effect: "grantRule",
          target: {
            selector: "bound",
            id: "selectedUnit",
          },
          rule: "cantReady",
          duration: "untilSourceNextTurn",
          conditions: [
            {
              condition: "streetCredParity",
              controller: "friendly",
              parity: "even",
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 4,
  power: 1,
}) satisfies UnitCardDefinition;
