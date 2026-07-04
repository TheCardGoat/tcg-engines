import type { LegendCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

const arasakaUnits = target.card({
  controller: "friendly",
  zones: ["field"],
  cardTypes: ["unit"],
  classifications: ["Arasaka"],
});

export const alphaSaburoArasakaStubbornPatriach = defineCyberpunkCard({
  id: "4c2533bc-1891-419c-bb25-49423a417a9b",
  slug: "saburo-arasaka-stubborn-patriach",
  rulesText:
    "Your Arasaka units have +1 power when attacking. (Units steal an extra gig for every 10 power.)",
  subname: "Stubborn Patriarch",
  name: "Saburo Arasaka",
  displayName: "Saburo Arasaka - Stubborn Patriarch",
  canonicalId: "saburo-arasaka-stubborn-patriach",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α005",
  artist: "ADIA",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a005.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  type: "legend",
  cost: null,
  power: 0,
  abilities: [
    AbilityBuilder.static()
      .text("Your Arasaka units have +1 power when attacking.")
      .effect(
        effect.modifyPower({
          target: arasakaUnits,
          value: 1,
          duration: "continuous",
          conditions: [condition.attacking({ target: arasakaUnits })],
        }),
      )
      .build(),
  ],
  reminderText: ["Units steal an extra gig for every 10 power."],
}) satisfies LegendCardDefinition;
