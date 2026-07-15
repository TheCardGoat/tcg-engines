import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailMamanBrigitteSpiritOfDeath = defineCyberpunkCard({
  id: "5380dea3-4d21-445b-af02-487b45d40395",
  slug: "maman-brigitte-spirit-of-death",
  rulesText: "{Play} You may discard 2 Programs. If you do, bottom-deck a rival unequipped Unit.",
  name: "Maman Brigitte — Spirit of Death",
  displayName: "Maman Brigitte — Spirit of Death",
  canonicalId: "maman-brigitte-spirit-of-death",
  color: "blue",
  classifications: ["Mystic", "Netrunner", "Voodoo Boys"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "118",
  artist: "TOPDOG Entertainment",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/118.webp",
  rarity: "Uncommon",
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
      text: "PLAY You may discard 2 Programs. If you do, bottom-deck an unequipped rival Unit.",
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
