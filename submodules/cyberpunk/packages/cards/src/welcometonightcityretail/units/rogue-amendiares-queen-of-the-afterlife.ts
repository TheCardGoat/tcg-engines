import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { quickAbility } from "@tcg/cyberpunk-types";

export const welcomeToNightCityRetailRogueAmendiaresQueenOfTheAfterlife = defineCyberpunkCard({
  id: "9d994a42-4a63-44ad-ad7a-edead6af06a2",
  canonicalId: "rogue-amendiares-queen-of-the-afterlife",
  slug: "rogue-amendiares-queen-of-the-afterlife",
  name: "Rogue Amendiares",
  subname: "Queen of the Afterlife",
  displayName: "Rogue Amendiares: Queen of the Afterlife",
  rulesText:
    "The first time another friendly Unit steals a Gig with value less than its power each turn, ready 2 Eddies.\n{Quick} 2 €$,  {Spend} A rival Unit loses power equal to this Unit's power this turn.",
  color: "blue",
  classifications: ["Fixer", "Merc"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "126",
  artist: "Mooncolony",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/126.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  keywords: ["quick"],
  abilities: [
    quickAbility({ text: "Quick" }),
    {
      kind: "triggered",
      text: "The first time another friendly Unit steals a Gig with value less than its power each turn, ready 2 Eddies.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: {
            selector: "gig",
            controller: "rival",
            amount: 1,
          },
          minAmount: 1,
          source: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            excludeSelf: true,
          },
          valueLessThanSourcePower: true,
        },
      },
      source: {
        selector: "self",
      },
      limits: ["firstTimeEachTurn"],
      effects: [
        {
          effect: "readyEddies",
          player: "friendly",
          amount: 2,
        },
      ],
    },
    {
      kind: "triggered",
      text: "2 €$, SPEND A rival Unit loses power equal to this Unit's power this turn.",
      trigger: {
        trigger: "activated",
      },
      source: {
        selector: "self",
      },
      costs: [
        {
          cost: "payEddies",
          amount: 2,
        },
        {
          cost: "spend",
          target: {
            selector: "self",
          },
        },
      ],
      effects: [
        {
          effect: "modifyPower",
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
          value: {
            type: "sourcePower",
            multiplier: -1,
          },
          duration: "turn",
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 4,
}) satisfies UnitCardDefinition;
