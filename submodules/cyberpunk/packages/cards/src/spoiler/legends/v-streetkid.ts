import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { goSoloAbility } from "@tcg/cyberpunk-types";

export const spoilerVStreetkid = defineCyberpunkCard({
  id: "1504a3cc-26ea-4415-8973-35fa6f14a7b8",
  slug: "v-streetkid",
  rulesText:
    "GO SOLO DEFEATED Discard the top 3 cards of your deck. Then, choose 1 Braindance Program from your trash and add it to your hand.",
  subname: "Streetkid",
  name: "V",
  displayName: "V - Streetkid",
  canonicalId: "v-streetkid",
  color: "red",
  classifications: ["Merc"],
  set: {
    code: "spoiler",
    name: "Spoiler Set",
  },
  printNumber: "132a",
  artist: "Pandart Studio",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/spoiler/132a.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  keywords: ["goSolo"],
  type: "legend",
  cost: 4,
  power: 3,
  abilities: [
    goSoloAbility(),
    {
      kind: "triggered",
      text: "DEFEATED Discard the top 3 cards of your deck. Then, choose 1 Braindance Program from your trash and add it to your hand.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "trashFromDeck",
          player: "friendly",
          amount: 3,
        },
        {
          effect: "moveCard",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["trash"],
            cardTypes: ["program"],
            classifications: ["Braindance"],
          },
          destination: "hand",
        },
      ],
    },
  ],
}) satisfies LegendCardDefinition;
