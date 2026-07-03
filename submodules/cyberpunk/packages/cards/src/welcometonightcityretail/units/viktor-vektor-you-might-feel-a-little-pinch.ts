import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch = defineCyberpunkCard({
  id: "647bb074-197f-4059-bac5-251b47c98287",
  canonicalId: "viktor-vektor-you-might-feel-a-little-pinch",
  slug: "viktor-vektor-you-might-feel-a-little-pinch",
  rulesText:
    "{Play} Play a CYBERWARE Gear with cost 2 or less from your trash for free. Equip it only to another friendly Unit.",
  name: "Viktor Vektor — You Might Feel a Little Pinch",
  displayName: "Viktor Vektor — You Might Feel a Little Pinch",
  color: "yellow",
  classifications: ["Ripperdoc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "058",
  artist: "Łukasz Poller",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/058.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "{Play} Play a CYBERWARE Gear with cost 2 or less from your trash for free. Equip it only to another friendly Unit.",
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
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
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
          effect: "attachCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["gear"],
            classifications: ["Cyberware"],
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
  ],
  type: "unit",
  cost: 3,
  power: 3,
}) satisfies UnitCardDefinition;
