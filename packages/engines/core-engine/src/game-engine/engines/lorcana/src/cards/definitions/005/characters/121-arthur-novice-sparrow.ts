import { recklessAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/recklessAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arthurNoviceSparrow: LorcanitoCharacterCardDefinition = {
  id: "b3l",
  name: "Arthur",
  title: "Novice Sparrow",
  characteristics: ["hero", "storyborn"],
  text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
  type: "character",
  abilities: [recklessAbility],
  flavour: "Hold it boy. Not so fast.\n−Merlin",
  colors: ["ruby"],
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 0,
  illustrator: "Brian Weisz",
  number: 121,
  set: "SSK",
  rarity: "uncommon",
};
