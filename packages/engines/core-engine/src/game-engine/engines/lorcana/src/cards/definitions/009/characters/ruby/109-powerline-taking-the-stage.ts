import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const powerlineTakingTheStage: LorcanaCharacterCardDefinition = {
  id: "mpw",
  name: "Powerline",
  title: "Taking the Stage",
  characteristics: ["storyborn"],
  text: "Singer 4 (This character counts as cost 4 to sing songs.)",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 3,
  willpower: 2,
  illustrator: "Stefano Spagnuolo",
  number: 109,
  set: "009",
  rarity: "common",
  abilities: [singerAbility(4)],
  lore: 1,
};
