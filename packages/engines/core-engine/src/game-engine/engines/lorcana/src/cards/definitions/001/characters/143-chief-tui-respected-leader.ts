import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chiefTui: LorcanaCharacterCardDefinition = {
  id: "ugn",

  name: "Chief Tui",
  title: "Respected Leader",
  characteristics: ["storyborn", "king", "mentor"],
  text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  illustrator: "Pirel",
  flavour: "You can always rely on the strength of those who love you.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 3,
  number: 143,
  set: "TFC",
  rarity: "uncommon",
};
