import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay = defineCyberpunkCard({
  id: "08e6a687-56b7-4ac1-982f-8a8d6d0c0bc5",
  canonicalId: "goro-takemura-losing-his-way",
  slug: "goro-takemura-losing-his-way",
  rulesText: "{Attack} If all friendly Legends are face-up, this Unit has +5 power this turn.",
  name: "Goro Takemura — Losing His Way",
  displayName: "Goro Takemura — Losing His Way",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "embracingpowerretailstarterdeck",
    name: "Embracing Power — Retail Starter Deck",
  },
  printNumber: "017",
  artist: "Ilya Kuvshinov",
  imageUrl:
    "https://cdn.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/017.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: ["attack"],
  abilities: [
    {
      kind: "triggered",
      text: "{Attack} If all friendly Legends are face-up, this Unit has +5 power this turn.",
      trigger: {
        trigger: "attack",
      },
      source: {
        selector: "self",
      },
      conditions: [
        {
          condition: "allFriendlyLegendsFaceUp",
        },
      ],
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "self",
          },
          value: 5,
          duration: "turn",
        },
      ],
    },
  ],
  type: "unit",
  cost: 4,
  power: 4,
}) satisfies UnitCardDefinition;
