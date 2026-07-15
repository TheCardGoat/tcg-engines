import type { BoxToppersRetailCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";

export const boxTopperRetailSaburoArasakaStubbornPatriarch = defineCyberpunkCard({
  id: "cf50fa24-bf94-4c35-bcc1-c6d56a6f68d8",
  slug: "saburo-arasaka-stubborn-patriarch",
  canonicalId: "saburo-arasaka-stubborn-patriarch",
  name: "Saburo Arasaka — Stubborn Patriarch",
  displayName: "Saburo Arasaka — Stubborn Patriarch",
  rulesText:
    "Friendly ARASAKA Units have +1 power while attacking.\n(Units steal an extra Gig for every 10 power.)",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "boxtoppersretail",
    name: "Box Toppers — Retail",
  },
  printNumber: "004",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/boxtoppersretail/004.webp",
  rarity: "Epic",
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  cost: null,
  power: null,
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
}) satisfies BoxToppersRetailCardDefinition;
