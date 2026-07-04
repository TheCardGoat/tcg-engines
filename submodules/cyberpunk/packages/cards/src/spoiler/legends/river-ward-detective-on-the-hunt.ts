import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerRiverWardDetectiveOnTheHunt = defineCyberpunkCard({
  id: "53886d23-5ec8-4d75-824f-9b02921e87dc",
  slug: "river-ward-detective-on-the-hunt",
  rulesText:
    "CALL Draw a card. When a Unit attacks, [Spend Icon]: Choose a Gear from your hand with cost 2 or less. Equip it for free to a friendly Yellow Unit with no equipped Gears.",
  subname: "Detective on the Hunt",
  name: "River Ward",
  displayName: "River Ward - Detective on the Hunt",
  canonicalId: "river-ward-detective-on-the-hunt",
  color: "yellow",
  classifications: ["NCPD"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "135",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/135.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["call"],
  type: "legend",
  cost: null,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "CALL Draw a card.",
      trigger: {
        trigger: "call",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
        },
      ],
    },
    {
      kind: "triggered",
      text: "When a Unit attacks, [Spend Icon]: Choose a Gear from your hand with cost 2 or less. Equip it for free to a friendly Yellow Unit with no equipped Gears.",
      trigger: {
        trigger: "event",
        event: {
          event: "cardAttacks",
          player: "any",
          target: {
            selector: "card",
            zones: ["field"],
            cardTypes: ["unit"],
          },
        },
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
            colors: ["yellow"],
            hasAttachedCards: false,
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
}) satisfies LegendCardDefinition;
