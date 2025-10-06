import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import {
  gainAbilityWhileHere,
  resistAbility,
} from "~/game-engine/engines/lorcana/src/abilities";

export const mauisPlaceOfExileHiddenIsland: LorcanaLocationCardDefinition = {
  id: "cpd",
  reprints: ["dk0"],
  type: "location",
  missingTestCase: true,
  name: "Maui's Place of Exile",
  title: "Hidden Island",
  characteristics: ["location"],
  text: "**ISOLATED** Characters gain **Resist** +1 while here. _(Damage dealt to them is reduced by 1.)_",
  abilities: [
    gainAbilityWhileHere({
      name: "ISOLATED",
      text: "Characters gain **Resist** +1 while here.",
      ability: resistAbility(1),
    }),
  ],
  flavour: "Nothing but boulders and sand-easy to miss.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  willpower: 5,
  lore: 0,
  moveCost: 1,
  illustrator: "Jeremy Adams",
  number: 202,
  set: "ITI",
  rarity: "rare",
};
