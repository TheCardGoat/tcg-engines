import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const theHeistRetailStarterDeckDexterDeshawnOneLastChance = defineCyberpunkCard({
  id: "f61b944a-32e3-4085-894b-7bd498325156",
  canonicalId: "dexter-deshawn-one-last-chance",
  slug: "dexter-deshawn-one-last-chance",
  rulesText:
    "{Play} {Attack} Adjust a Gig by up to 1.\n{Defeated} If your ☆ (Street Cred) differs from a Rival's by 10+, draw 2.",
  name: "Dexter DeShawn — One Last Chance",
  displayName: "Dexter DeShawn — One Last Chance",
  color: "yellow",
  classifications: ["Fixer"],
  set: {
    code: "theheistretailstarterdeck",
    name: "The Heist — Retail Starter Deck",
  },
  printNumber: "002",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/002.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  timingTriggers: ["play", "attack"],
  abilities: [
    {
      kind: "triggered",
      text: "{Play} Adjust a Gig by up to 1.",
      trigger: {
        trigger: "play",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            amount: 1,
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 1,
          direction: "either",
          chooseUpTo: true,
        },
      ],
    },
    {
      kind: "triggered",
      text: "{Attack} Adjust a Gig by up to 1.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      bindings: [
        {
          id: "selectedGig",
          target: {
            selector: "gig",
            amount: 1,
            selection: {
              mode: "choose",
              min: 0,
              max: 1,
            },
          },
        },
      ],
      effects: [
        {
          effect: "adjustGig",
          target: {
            selector: "bound",
            id: "selectedGig",
          },
          maxAmount: 1,
          direction: "either",
          chooseUpTo: true,
        },
      ],
    },
    {
      kind: "triggered",
      text: "{Defeated} If your ☆ (Street Cred) differs from a Rival's by 10+, draw 2.",
      trigger: {
        trigger: "defeated",
      },
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 2,
          conditions: [
            {
              condition: "streetCredDifference",
              controller: "friendly",
              comparison: "gte",
              other: "rival",
              value: 10,
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 3,
  power: 4,
}) satisfies UnitCardDefinition;
