import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { defineCyberpunkCard } from "../../define.ts";
import { AbilityBuilder, condition, effect, target } from "../../helpers/builders/index.ts";

export const alphaGoroTakemuraLosingHisWay = defineCyberpunkCard({
  id: "963f4fd2-9a58-4b50-96f9-d947d4105b56",
  slug: "goro-takemura-losing-his-way",
  rulesText:
    "This unit has +1 power during your turn for each face-up legend in your legends area.",
  subname: "Losing His Way",
  name: "Goro Takemura",
  displayName: "Goro Takemura - Losing His Way",
  canonicalId: "goro-takemura-losing-his-way",
  color: "green",
  classifications: ["Arasaka", "Corpo"],
  set: {
    code: "alpha",
    name: "Alpha Kit Set",
  },
  printNumber: "α018",
  artist: "Ilya Kuvshinov",
  imageUrl: "https://cdn.tcg.online/public/cyberpunk/cards/alpha/a018.webp",
  rarity: null,
  legality: "legal",
  hasSellTag: false,
  ram: 3,
  type: "unit",
  cost: 4,
  power: 5,
  abilities: [
    AbilityBuilder.static()
      .text("This unit has +1 power during your turn for each face-up legend in your legends area.")
      .effect(
        effect.modifyPower({
          target: target.self(),
          value: {
            type: "perCount",
            multiplier: 1,
            target: target.card({
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              face: "faceUp",
            }),
          },
          duration: "continuous",
          conditions: [condition.turn({ player: "friendly" })],
        }),
      )
      .build(),
  ],
}) satisfies UnitCardDefinition;
