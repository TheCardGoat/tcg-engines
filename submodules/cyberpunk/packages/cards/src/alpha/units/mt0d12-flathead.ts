import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaMt0d12Flathead = defineCyberpunkCard({
  id: "0a77db39-d894-4df5-815a-40ffeb01fa27",
  slug: "mt0d12-flathead",
  rulesText: "If you have 7+ * (Street Cred), this unit can't be blocked.",
  name: "MT0D12 Flathead",
  displayName: "MT0D12 Flathead",
  canonicalId: "mt0d12-flathead",
  color: "blue",
  classifications: ["Militech", "Drone"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α012",
  artist: "Frederico Sabbatini",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a012.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
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
}) satisfies UnitCardDefinition;
