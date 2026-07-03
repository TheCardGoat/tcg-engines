import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerDumDumMaelstromTriggerman = defineCyberpunkCard({
  id: "15e5c60e-56c4-4a1a-a7cf-f208c5ffbee8",
  slug: "dum-dum-maelstrom-triggerman",
  rulesText:
    "CALL You may defeat a friendly Gear. If you do, draw 4 cards. Otherwise, draw 1 card.",
  subname: "Maelstrom Triggerman",
  name: "Dum Dum",
  displayName: "Dum Dum - Maelstrom Triggerman",
  canonicalId: "dum-dum-maelstrom-triggerman",
  color: "yellow",
  classifications: ["Ganger", "Maelstrom"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "133",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/133.webp",
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
      text: "CALL You may defeat a friendly Gear. If you do, draw 4 cards. Otherwise, draw 1 card.",
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
              amount: 4,
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
  ],
}) satisfies LegendCardDefinition;
