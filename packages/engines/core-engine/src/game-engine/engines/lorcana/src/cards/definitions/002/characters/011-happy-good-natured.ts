import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const happyGoodNatured: LorcanitoCharacterCardDefinition = {
  id: "gx6",
  name: "Happy",
  title: "Good-Natured",
  characteristics: ["storyborn", "ally", "seven dwarfs"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour: "You couldn't pick a better friend.",
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Kendall Hale",
  number: 11,
  set: "ROF",
  rarity: "common",
};
