import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailSketchyRipper = defineCyberpunkCard({
  id: "b3b40c68-705b-41ff-ae10-4132497c4a39",
  slug: "sketchy-ripper",
  rulesText:
    "{Attack} Search the top 3 cards of your deck. Reveal a Gear and add it to your hand. Bottom-deck the rest.\n(Units with power 0 don't steal Gigs.)",
  name: "Sketchy Ripper",
  displayName: "Sketchy Ripper",
  canonicalId: "sketchy-ripper",
  color: "yellow",
  classifications: ["Ganger", "Ripperdoc", "Scavenger"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "054",
  artist: "Michał Dziekan",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/054.webp",
  rarity: "Common",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["attack"],
  type: "unit",
  cost: 2,
  power: 0,
  abilities: [
    {
      kind: "triggered",
      text: "ATTACK Search the top 3 cards of your deck. Reveal a Gear and add it to your hand. Bottom-deck the rest.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "scry",
          player: "friendly",
          amount: 3,
          destinations: [
            {
              zone: "hand",
              min: 0,
              max: 1,
              reveal: true,
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["deck"],
                cardTypes: ["gear"],
              },
            },
            {
              zone: "deckBottom",
              remainder: true,
              order: "original",
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
