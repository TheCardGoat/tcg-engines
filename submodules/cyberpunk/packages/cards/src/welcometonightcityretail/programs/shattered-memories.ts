import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailShatteredMemories = defineCyberpunkCard({
  id: "050d0502-94b0-4bee-a7e6-a9b00f31b4ae",
  canonicalId: "shattered-memories",
  slug: "shattered-memories",
  name: "Shattered Memories",
  displayName: "Shattered Memories",
  rulesText:
    "Each player discards their hand and may draw 5.\nIf the total number of discarded cards equals the value of a friendly Gig, draw 2.",
  color: "red",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "035",
  artist: "Max Fiumara",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/035.webp",
  rarity: "Rare",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: ["play"],
  abilities: [
    {
      kind: "triggered",
      text: "Each player discards their hand and may draw 5. If the total number of discarded cards equals the value of a friendly Gig, draw 2.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "discardFromHand",
          player: "friendly",
          amount: "all",
        },
        {
          effect: "discardFromHand",
          player: "rival",
          amount: "all",
        },
        {
          effect: "chooseEffect",
          chooser: "friendly",
          options: [
            {
              id: "draw",
              label: "Draw 5",
              effects: [
                {
                  effect: "draw",
                  player: "friendly",
                  amount: 5,
                },
              ],
            },
            {
              id: "skip",
              label: "Do not draw",
              effects: [],
            },
          ],
        },
        {
          effect: "chooseEffect",
          chooser: "rival",
          options: [
            {
              id: "draw",
              label: "Draw 5",
              effects: [
                {
                  effect: "draw",
                  player: "rival",
                  amount: 5,
                },
              ],
            },
            {
              id: "skip",
              label: "Do not draw",
              effects: [],
            },
          ],
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "discardedCountMatchesGig",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
  type: "program",
  cost: 4,
}) satisfies ProgramCardDefinition;
