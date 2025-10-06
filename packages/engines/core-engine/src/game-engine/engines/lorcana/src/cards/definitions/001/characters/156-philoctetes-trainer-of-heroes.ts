import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const philoctetes: LorcanitoCharacterCardDefinition = {
  id: "z5i",

  name: "Philoctetes",
  title: "Trainer of Heroes",
  characteristics: ["storyborn", "mentor"],
  text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour: "Ya gotta be the best to train the best. And I train the best!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 156,
  set: "TFC",
  rarity: "common",
};
