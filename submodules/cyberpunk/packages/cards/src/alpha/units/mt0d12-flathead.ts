import type { AlphaCardDefinition } from "@tcg/cyberpunk-types";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaMt0d12Flathead = {
  id: "0a77db39-d894-4df5-815a-40ffeb01fa27",
  externalId: "cyberpunk:mt0d12-flathead",
  slug: "mt0d12-flathead",
  name: "MT0D12 Flathead",
  subname: null,
  displayName: "MT0D12 Flathead",
  rulesText: "If you have 7+ Street Cred, this unit can't be blocked.",
  flavorText: null,
  color: "blue",
  classifications: ["Militech", "Drone"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α012",
  printings: [
    {
      id: "1823a6ee-bff7-47b4-bc58-589ecddee538",
      collectorNumber: "α012",
      imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a012.webp",
      sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a012.webp",
      set: {
        code: "alpha",
        name: "Alpha Kit Set",
      },
      rarity: null,
      finish: "standard",
      artist: "Frederico Sabbatini",
    },
  ],
  selectedPrintingId: "1823a6ee-bff7-47b4-bc58-589ecddee538",
  artist: "Frederico Sabbatini",
  imageUrl: "https://r2.tcg.online/public/cyberpunk/cards/alpha/a012.webp",
  sourceImageUrl: "https://dstcynss47vun.cloudfront.net/prod/cyberpunk/a012.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  timingTriggers: [],
  keywords: [],
  type: "unit",
  cost: 5,
  power: 5,
  abilities: [
    AbilityBuilder.static()
      .text("If you have 7+ Street Cred, this unit can't be blocked.")
      .effect(
        effect.grantRule({
          target: target.self(),
          rule: "cantBeBlocked",
          duration: "continuous",
          conditions: [
            condition.streetCred({ controller: "friendly", comparison: "gte", value: 7 }),
          ],
        }),
      )
      .build(),
  ],
  reminderText: [],
} satisfies AlphaCardDefinition;
