import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, effect, target } from "../../helpers/builders/index.ts";

export const theHeistRetailStarterDeckMt0d12Flathead = defineCyberpunkCard({
  id: "619429c9-132f-496e-8aa0-414e850c87ec",
  slug: "mt0d12-flathead",
  rulesText: "If you have less ☆ (Street Cred) than a Rival, this Unit can't be blocked.",
  name: "MT0D12 Flathead",
  displayName: "MT0D12 Flathead",
  canonicalId: "mt0d12-flathead",
  color: "blue",
  classifications: ["Drone", "Militech"],
  set: {
    code: "theheistretailstarterdeck",
    name: "The Heist — Retail Starter Deck",
  },
  printNumber: "015",
  artist: "Federico Sabbatini",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/theheistretailstarterdeck/015.webp",
  rarity: "Uncommon",
  legality: "legal",
  hasSellTag: true,
  ram: 3,
  type: "unit",
  cost: 5,
  power: 7,
  abilities: [
    AbilityBuilder.static()
      .text("If you have less ☆ (Street Cred) than a Rival, this Unit can't be blocked.")
      .effect(
        effect.grantRule({
          target: target.self(),
          rule: "cantBeBlocked",
          duration: "continuous",
          conditions: [
            {
              condition: "streetCredComparison",
              controller: "friendly",
              comparison: "lt",
              other: "rival",
            },
          ],
        }),
      )
      .build(),
  ],
}) satisfies UnitCardDefinition;
