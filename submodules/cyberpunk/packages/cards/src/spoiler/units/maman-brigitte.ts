import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const spoilerMamanBrigitte = defineCyberpunkCard({
  id: "0e07190f-3e75-4b5e-ba24-5840801d9f34",
  slug: "maman-brigitte",
  rulesText: "PLAY You may discard 2 Programs. If you do, bottom-deck a rival unequipped Unit.",
  name: "Maman Brigitte",
  displayName: "Maman Brigitte",
  canonicalId: "maman-brigitte",
  color: "blue",
  classifications: ["Mystic", "Netrunner", "Voodoo Boys"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "118",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/118.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 4,
  timingTriggers: ["play"],
  type: "unit",
  cost: 5,
  power: 3,
  abilities: [
    {
      kind: "triggered",
      text: "PLAY You may discard 2 Programs. If you do, bottom-deck a rival unequipped Unit.",
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
            amount: 2,
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
                hasAttachedCards: false,
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
