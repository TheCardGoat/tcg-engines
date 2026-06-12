import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

const arasakaUnits = target.card({
  controller: "friendly",
  zones: ["field"],
  cardTypes: ["unit"],
  classifications: ["Arasaka"],
});

export const alphaSaburoArasakaStubbornPatriach = {
  id: "4c2533bc-1891-419c-bb25-49423a417a9b",
  externalId: "cyberpunk:saburo-arasaka-stubborn-patriach",
  slug: "saburo-arasaka-stubborn-patriach",
  name: "Saburo Arasaka",
  subname: "Stubborn Patriarch",
  displayName: "Saburo Arasaka - Stubborn Patriarch",
  rulesText: "Your Arasaka units have +1 power when attacking.",
  flavorText: null,
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α005",
  printings: [
    {
      id: "8f659e65-e926-4a20-bde4-76bad5fd4d85",
      collectorNumber: "α005",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a005.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a005.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "ADIA",
    },
    {
      id: "2ffb4de9-2e4b-4eb6-ac49-5859bf487955",
      collectorNumber: "α029",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a029.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a029.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "foil",
      artist: "Vincenzo Riccardi",
    },
  ],
  selectedPrintingId: "8f659e65-e926-4a20-bde4-76bad5fd4d85",
  artist: "ADIA",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a005.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a005.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: true,
  ram: 2,
  timingTriggers: [],
  keywords: [],
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
} satisfies AlphaCardDefinition;
