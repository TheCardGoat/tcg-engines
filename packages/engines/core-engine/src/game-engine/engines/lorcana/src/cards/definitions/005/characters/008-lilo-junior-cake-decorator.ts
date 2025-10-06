import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liloJuniorCakeDecorator: LorcanaCharacterCardDefinition = {
  id: "yur",
  name: "Lilo",
  title: "Junior Cake Decorator",
  characteristics: ["hero", "storyborn"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour: "Peanut butter and pineapple! This'll be the best cake ever!",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Olivier Désirée",
  number: 8,
  set: "SSK",
  rarity: "common",
};
