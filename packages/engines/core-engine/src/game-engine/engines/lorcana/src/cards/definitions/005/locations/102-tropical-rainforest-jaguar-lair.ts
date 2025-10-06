import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tropicalRainforestJaguarLair: LorcanaLocationCardDefinition = {
  id: "voi",
  missingTestCase: true,
  name: "Tropical Rainforest",
  title: "Jaguar Lair",
  characteristics: ["location"],
  text: "**SNACK TIME** Opposing damaged characters gain **Reckless**. _(They can’t quest and must challenge if able.)_",
  type: "location",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Snack Time",
      text: "Opposing damaged characters gain **Reckless**. _(They can’t quest and must challenge if able.)_",
      gainedAbility: recklessAbility,
      target: {
        type: "card",
        value: "all",
        excludeSelf: true,
        filters: [
          { filter: "zone", value: "play" },
          { filter: "type", value: "character" },
          { filter: "owner", value: "opponent" },
          {
            filter: "status",
            value: "damage",
            comparison: { operator: "gte", value: 1 },
          },
        ],
      },
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  willpower: 6,
  lore: 1,
  illustrator: "Andreas Rocha",
  number: 102,
  set: "SSK",
  rarity: "uncommon",
  moveCost: 1,
};
