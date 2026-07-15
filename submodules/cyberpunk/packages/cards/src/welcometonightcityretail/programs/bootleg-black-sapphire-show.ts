import type { ProgramCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailBootlegBlackSapphireShow = defineCyberpunkCard({
  id: "84561b4c-67f0-4b2e-80ac-6b9c0a2396e3",
  slug: "bootleg-black-sapphire-show",
  rulesText:
    "Sell the top card of your deck.\nIf you control a Gig with an even value and a Gig with an odd value, draw 2.",
  name: "Bootleg Black Sapphire Show",
  displayName: "Bootleg Black Sapphire Show",
  canonicalId: "bootleg-black-sapphire-show",
  color: "yellow",
  classifications: ["Braindance"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "066",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/066.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 4,
  timingTriggers: ["play"],
  type: "program",
  cost: 5,
  power: null,
  abilities: [
    {
      kind: "triggered",
      text: "Sell the top card of your deck. If you control a Gig with an even value and a Gig with an odd value, draw 2.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "sellFromDeck",
          player: "friendly",
          amount: 1,
        },
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "hasEvenAndOddGigValues",
              controller: "friendly",
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Discard programs after they resolve."],
}) satisfies ProgramCardDefinition;
