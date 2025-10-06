// TODO: Once the set is released, we organize the cards by set and type

import {
  evasiveAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofyFlyingFool: LorcanaCharacterCardDefinition = {
  id: "iyl",
  name: "Goofy",
  title: "Flying Goof",
  characteristics: ["storyborn", "hero"],
  text: "Rush (This character can challenge the turn they're played.)\nEvasive (Only characters with Evasive can challenge this character.)",
  type: "character",
  abilities: [rushAbility, evasiveAbility],
  inkwell: false,
  colors: ["ruby"],
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 123,
  set: "006",
  rarity: "rare",
};
