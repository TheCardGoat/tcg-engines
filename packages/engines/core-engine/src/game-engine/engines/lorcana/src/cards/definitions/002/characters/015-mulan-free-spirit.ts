import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanFreeSpirit: LorcanaCharacterCardDefinition = {
  id: "ad4",
  reprints: ["efk"],
  name: "Mulan",
  title: "Free Spirit",
  characteristics: ["hero", "dreamborn", "princess"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour: "Everything looks better when you're free to be yourself.",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Amber Kommavongsa",
  number: 15,
  set: "ROF",
  rarity: "common",
};
