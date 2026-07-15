import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailPlacideVoodooSentinel = defineCyberpunkCard({
  id: "783a9082-b79c-4b45-bf66-48728ff9b92d",
  slug: "placide-voodoo-sentinel",
  rulesText: "{Play} {Attack} You may discard 1 Program. If you do, bottom-deck a rival Unit.",
  name: "Placide — Voodoo Sentinel",
  displayName: "Placide — Voodoo Sentinel",
  canonicalId: "placide-voodoo-sentinel",
  color: "blue",
  classifications: ["Ganger", "Netrunner", "Voodoo Boys"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "123",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/123.webp",
  rarity: "Rare",
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
      text: "PLAY ATTACK You may discard 1 Program. If you do, bottom-deck a rival Unit.",
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
            effect: "discardFromHand",
            player: "friendly",
            amount: 1,
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
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
      text: "PLAY ATTACK You may discard 1 Program. If you do, bottom-deck a rival Unit.",
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
            effect: "discardFromHand",
            player: "friendly",
            amount: 1,
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["hand"],
              cardTypes: ["program"],
            },
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
