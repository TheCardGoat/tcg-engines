import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailCaliberTotentanzSTopDog = defineCyberpunkCard({
  id: "0273f402-94fb-4b59-90ec-a1057c2d1284",
  slug: "caliber-totentanz-s-top-dog",
  rulesText:
    "{Play} Defeat a rival Unit with cost 2 or less.\n{Defeated} A Rival discards 1. If the card's cost equals the value of a friendly Gig, that Rival discards 1 more.",
  name: "Caliber — Totentanz's Top Dog",
  displayName: "Caliber — Totentanz's Top Dog",
  canonicalId: "caliber-totentanz-s-top-dog",
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "044",
  artist: "André Lima Araújo & Chris O'Halloran",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/044.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play"],
  type: "unit",
  cost: 5,
  power: 5,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY Defeat a rival Unit with cost 2 or less.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "defeat",
          target: {
            selector: "card",
            controller: "rival",
            zones: ["field"],
            cardTypes: ["unit"],
            maxCost: 2,
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
      kind: "triggered",
      text: "DEFEATED A Rival discards 1. If the card's cost equals the value of a friendly Gig, that Rival discards 1 more.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
        },
        {
          effect: "discardFromHand",
          player: "rival",
          amount: 1,
          conditions: [
            {
              condition: "costMatchesGig",
              target: {
                selector: "context",
                key: "discardedCards",
              },
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
