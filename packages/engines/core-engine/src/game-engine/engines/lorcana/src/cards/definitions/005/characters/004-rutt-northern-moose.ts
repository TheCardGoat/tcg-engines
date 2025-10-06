import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ruttNorthernMoose: LorcanitoCharacterCardDefinition = {
  id: "l3d",
  name: "Rutt",
  title: "Northern Moose",
  characteristics: ["storyborn", "ally"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour: "Let's find some nice twigs, eh? I could use a snack!",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Ron Baird",
  number: 4,
  set: "SSK",
  rarity: "common",
};
