import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilPracticedDetective: LorcanaCharacterCardDefinition = {
  id: "orz",
  name: "Basil",
  title: "Practiced Detective",
  characteristics: ["hero", "storyborn", "detective"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour: "This case is as good as solved!\n−Basil",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  illustrator: "Eva Widermann",
  number: 153,
  set: "SSK",
  rarity: "common",
};
