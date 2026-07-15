import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { blockerAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailLaLloronaGhostOfThePast = defineCyberpunkCard({
  id: "1b516742-cdf3-4597-8ba1-be787240ab3b",
  canonicalId: "la-llorona-ghost-of-the-past",
  slug: "la-llorona-ghost-of-the-past",
  rulesText:
    "{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)\nWhen this Unit uses {Blocker}, increase a Gig by up to 3.",
  name: "La Llorona — Ghost of the Past",
  displayName: "La Llorona — Ghost of the Past",
  color: "red",
  classifications: ["Ganger", "Valentino"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "013",
  artist: "Jesus Hervás",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/013.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 1,
  keywords: ["blocker"],
  abilities: [
    blockerAbility({
      text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
    }),
    {
      kind: "triggered",
      text: "When this Unit uses Blocker, increase a Gig by up to 3.",
      trigger: {
        trigger: "event",
        event: {
          event: "blockerActivated",
          player: "friendly",
          target: {
            selector: "self",
          },
        },
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "gig",
            controller: "friendly",
            amount: "all",
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
          direction: "increase",
          maxAmount: 3,
          chooseUpTo: true,
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 3,
}) satisfies UnitCardDefinition;
