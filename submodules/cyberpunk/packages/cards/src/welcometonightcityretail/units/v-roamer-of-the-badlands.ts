import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const welcomeToNightCityRetailVRoamerOfTheBadlands = defineCyberpunkCard({
  id: "9ed58d18-df78-4689-b28f-77260243c522",
  canonicalId: "v-roamer-of-the-badlands",
  slug: "v-roamer-of-the-badlands",
  subname: "Roamer of the Badlands",
  name: "V",
  displayName: "V: Roamer of the Badlands",
  rulesText:
    "When this Unit steals a Gig, increase it by up to 5.\nAt the end of your turn, if you control 2 or more Gigs with 8+ value, draw 1.",
  color: "red",
  classifications: ["Merc", "Nomad"],
  set: {
    code: "welcometonightcityretail",
    name: "Welcome to Night City — Retail",
  },
  printNumber: "020",
  artist: "Dardo Studios",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/020.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: false,
  ram: 2,
  abilities: [
    {
      kind: "triggered",
      text: "When this Unit steals a Gig, increase it by up to 5.",
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          target: { selector: "gig", controller: "friendly", amount: 1 },
          minAmount: 1,
          source: { selector: "self" },
        },
      },
      source: { selector: "self" },
      effects: [
        {
          effect: "adjustGig",
          target: { selector: "context", key: "triggeredGigs" },
          maxAmount: 5,
          direction: "increase",
          chooseUpTo: true,
        },
      ],
    },
    {
      kind: "triggered",
      text: "At the end of your turn, if you control 2 or more Gigs with 8+ value, draw 1.",
      trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
      source: { selector: "self" },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: 1,
          conditions: [
            {
              condition: "hasGigCount",
              controller: "friendly",
              minValue: 8,
              comparison: "gte",
              value: 2,
            },
          ],
        },
      ],
    },
  ],
  type: "unit",
  cost: 5,
  power: 6,
}) satisfies UnitCardDefinition;
