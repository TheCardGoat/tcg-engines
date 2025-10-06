// TODO: Once the set is released, we organize the cards by set and type

import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilHypnotizedMouse: LorcanaCharacterCardDefinition = {
  id: "i84",
  name: "Basil",
  title: "Hypnotized Mouse",
  characteristics: ["dreamborn", "hero", "detective"],
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  type: "character",
  abilities: [evasiveAbility],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 79,
  set: "006",
  rarity: "common",
};
