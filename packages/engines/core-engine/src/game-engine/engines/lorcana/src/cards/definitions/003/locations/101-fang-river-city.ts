import {
  evasiveAbility,
  gainAbilityWhileHere,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fangRiverCity: LorcanaLocationCardDefinition = {
  id: "pji",
  type: "location",
  name: "Fang",
  title: "River City",
  characteristics: ["location"],
  text: "**SURROUNDED BY WATER** Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
  abilities: [
    gainAbilityWhileHere({
      name: "Surrounded by Water",
      text: "Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
      ability: wardAbility,
    }),
    gainAbilityWhileHere({
      name: "Surrounded by Water",
      text: "Characters gain **Ward** and **Evasive** while here. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
      ability: evasiveAbility,
    }),
  ],
  flavour:
    "A nation protected by fierce assassins and their even fiercer cats.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  willpower: 6,
  lore: 2,
  moveCost: 2,
  illustrator: "Michael Guimont",
  number: 101,
  set: "ITI",
  rarity: "rare",
};
