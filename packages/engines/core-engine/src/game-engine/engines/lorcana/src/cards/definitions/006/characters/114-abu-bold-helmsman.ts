// TODO: Once the set is released, we organize the cards by set and type

import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const abuBoldHelmsman: LorcanaCharacterCardDefinition = {
  id: "qts",
  name: "Abu",
  title: "Bold Helmsman",
  characteristics: ["storyborn", "ally"],
  text: "Rush (This character can challenge the turn they’re played.)",
  type: "character",
  abilities: [rushAbility],
  inkwell: false,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "OggysonArt",
  number: 114,
  set: "006",
  rarity: "common",
};
