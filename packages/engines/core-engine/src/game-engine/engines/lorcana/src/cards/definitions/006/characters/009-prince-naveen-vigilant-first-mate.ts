// TODO: Once the set is released, we organize the cards by set and type

import {
  bodyguardAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princeNaveenVigilantFirstMate: LorcanaCharacterCardDefinition = {
  id: "o4d",
  name: "Prince Naveen",
  title: "Vigilant First Mate",
  characteristics: ["floodborn", "hero", "prince"],
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Prince Naveen.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  type: "character",
  abilities: [shiftAbility(3, "Prince Naveen"), bodyguardAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  illustrator: "Francesco Colucci",
  number: 9,
  set: "006",
  rarity: "uncommon",
};
