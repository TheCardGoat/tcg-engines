import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch = defineCyberpunkCard({
  id: "cf50fa24-bf94-4c35-bcc1-c6d56a6f68d8",
  canonicalId: "saburo-arasaka-stubborn-patriarch",
  slug: "saburo-arasaka-stubborn-patriarch",
  rulesText:
    "Friendly ARASAKA Units have +1 power while attacking.\n(Units steal an extra Gig for every 10 power.)",
  name: "Saburo Arasaka — Stubborn Patriarch",
  displayName: "Saburo Arasaka — Stubborn Patriarch",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "embracingpowerretailstarterdeck",
    name: "Embracing Power — Retail Starter Deck",
  },
  printNumber: "013",
  artist: "ADIA",
  imageUrl:
    "https://cdn.tcg.online/public/cyberpunk/cards/embracingpowerretailstarterdeck/013.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  abilities: [
    {
      kind: "static",
      text: "Friendly ARASAKA Units have +1 power while attacking.",
      source: {
        selector: "self",
      },
      effects: [
        {
          effect: "modifyPower",
          target: {
            selector: "card",
            controller: "friendly",
            zones: ["field"],
            cardTypes: ["unit"],
            classifications: ["Arasaka"],
          },
          value: 1,
          duration: "continuous",
          conditions: [
            {
              condition: "attacking",
              target: {
                selector: "self",
              },
            },
          ],
        },
      ],
    },
  ],
  reminderText: ["Units steal an extra Gig for every 10 power."],
  type: "legend",
  cost: null,
  power: null,
}) satisfies LegendCardDefinition;
