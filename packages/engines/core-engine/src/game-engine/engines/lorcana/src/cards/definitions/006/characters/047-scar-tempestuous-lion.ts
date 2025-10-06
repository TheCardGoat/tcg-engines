// TODO: Once the set is released, we organize the cards by set and type

import {
  challengerAbility,
  rushAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scarTempestuousLion: LorcanaCharacterCardDefinition = {
  id: "i6n",
  name: "Scar",
  title: "Tempestuous Lion",
  characteristics: ["dreamborn", "villain", "sorcerer"],
  text: "Rush (This character can challenge the turn they're played.)\nChallenger +3 (While challenging, this character gets +3 {S}.)",
  type: "character",
  abilities: [rushAbility, challengerAbility(3)],
  inkwell: false,
  colors: ["amethyst"],
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Peter Broeckhammer",
  number: 47,
  set: "006",
  rarity: "uncommon",
};
