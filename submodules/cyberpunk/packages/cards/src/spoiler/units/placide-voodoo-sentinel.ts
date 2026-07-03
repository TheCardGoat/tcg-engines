import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerPlacideVoodooSentinel = defineCyberpunkCard({
  id: "7cd71a63-f430-4e26-884c-3956f929dfef",
  slug: "placide-voodoo-sentinel",
  rulesText:
    "PLAY ATTACK You may discard a Program from your hand. If you do, bottom-deck a rival Unit.",
  subname: "Voodoo Sentinel",
  name: "Placide",
  displayName: "Placide - Voodoo Sentinel",
  canonicalId: "placide-voodoo-sentinel",
  color: "blue",
  classifications: ["Ganger", "Netrunner", "Voodoo Boys"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "073",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/073.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play", "attack"],
  type: "unit",
  cost: 8,
  power: 10,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY ATTACK You may discard a Program from your hand. If you do, bottom-deck a rival Unit.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "moveCard",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
            destination: "trash",
            optional: true,
          },
          ifEffects: [
            {
              effect: "moveCard",
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
              destination: "deckBottom",
            },
          ],
        },
      ],
    },
    {
      kind: "triggered",
      text: "PLAY ATTACK You may discard a Program from your hand. If you do, bottom-deck a rival Unit.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "ifYouDo",
          doEffect: {
            effect: "moveCard",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
            destination: "trash",
            optional: true,
          },
          ifEffects: [
            {
              effect: "moveCard",
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
              destination: "deckBottom",
            },
          ],
        },
      ],
    },
  ],
}) satisfies UnitCardDefinition;
