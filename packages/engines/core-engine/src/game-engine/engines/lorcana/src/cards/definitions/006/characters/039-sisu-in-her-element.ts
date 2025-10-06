// TODO: Once the set is released, we organize the cards by set and type

import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sisuInHerElement: LorcanaCharacterCardDefinition = {
  id: "cw6",
  name: "Sisu",
  title: "In Her Element",
  characteristics: ["hero", "storyborn", "dragon", "deity"],
  text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_",
  type: "character",
  abilities: [challengerAbility(2)],
  flavour: "I'm a water dragon. This is water. It's sort of my thing.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Grace Tran",
  number: 39,
  set: "006",
  rarity: "common",
};
