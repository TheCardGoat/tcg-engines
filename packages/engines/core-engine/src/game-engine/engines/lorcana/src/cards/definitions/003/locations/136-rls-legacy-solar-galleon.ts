import {
  evasiveAbility,
  gainAbilityWhileHere,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";

export const rlsLegacySolarGalleon: LorcanaLocationCardDefinition = {
  id: "ok0",
  type: "location",
  name: "RLS Legacy",
  title: "Solar Galleon",
  characteristics: ["location"],
  text: "**THIS IS OUR SHIP** Characters gain **Evasive** while here. _(Only characters with Evasive can challenge them.)_\n\n\n**HEAVE TOGETHER NOW** If you have a character here, you pay 2 {I} less to move a character of yours here.",
  abilities: [
    propertyStaticAbilities({
      name: "HEAVE TOGETHER NOW",
      text: "If you have a character here, you pay 2 {I} less to move a character of yours here.",
      attribute: "moveCost",
      amount: 2,
      modifier: "subtract",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
      ],
    }),
    gainAbilityWhileHere({
      name: "This is Our Ship",
      text: "Characters gain **Evasive** while here. _(Only characters with Evasive can challenge them.)_",
      ability: evasiveAbility,
    }),
  ],
  colors: ["ruby"],
  cost: 4,
  willpower: 8,
  moveCost: 3,
  lore: 2,
  illustrator: "Wietse Treurniet",
  number: 136,
  set: "ITI",
  rarity: "rare",
};
