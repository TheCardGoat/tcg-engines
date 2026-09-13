import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRogueAmendiaresPreemSolo = defineCyberpunkCard({
  id: "012b0300-6af1-417e-86a2-dc208a60ac15",
  canonicalId: "rogue-amendiares-preem-solo",
  slug: "rogue-amendiares-preem-solo",
  subname: "Preem Solo",
  name: "Rogue Amendiares",
  displayName: "Rogue Amendiares: Preem Solo",
  rulesText:
    "{Go Solo} (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)\nWhen a friendly Legend steals a Gig, if its value is even, draw 1. If its value is odd, a Rival discards 1.",
  color: "yellow",
  classifications: ["Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "040",
  artist: "Olgierd Ciszak",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/040.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  abilities: [
    goSoloAbility({
      text: "Go Solo (Pay this Legend's cost to play it as a ready Unit. It can attack this turn. If it leaves the field, remove it from the game.)",
    }),
    {
      kind: "triggered",
      text: "When a friendly Legend steals a Gig, if its value is even, draw 1. If its value is odd, a Rival discards 1.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
            amount: 1,
          },
          minAmount: 1,
          source: {
            selector: "card",
            controller: "friendly",
            cardTypes: ["legend"],
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "targetParity",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              property: "gigValue",
              parity: "even",
            },
          ],
        },
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
          conditions: [
            {
              condition: "targetParity",
              target: {
                selector: "context",
                key: "triggeredGigs",
              },
              property: "gigValue",
              parity: "odd",
            },
          ],
        },
      ],
    },
  ],
  type: "legend",
  cost: 7,
  power: 7,
}) satisfies LegendCardDefinition;
