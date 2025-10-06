// TODO: Once the set is released, we organize the cards by set and type

import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const marchHareAbsurdHost: LorcanaCharacterCardDefinition = {
  id: "o8f",
  name: "March Hare",
  title: "Absurd Host",
  characteristics: ["storyborn"],
  text: "Rush (This character can challenge the turn they're played.)",
  type: "character",
  abilities: [rushAbility],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "James Rey Sanchez",
  number: 50,
  set: "006",
  rarity: "uncommon",
};
