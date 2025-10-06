import {
  bodyguardAbility,
  supportAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maximusPalaceHorse: LorcanitoCharacterCardDefinition = {
  id: "pfk",
  name: "Maximus",
  title: "Palace Horse",
  characteristics: ["storyborn", "ally"],
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**Support** _(Whenever this character quests, you may add their {S} to another chosen character‘s {S} this turn.)",
  type: "character",
  abilities: [supportAbility, bodyguardAbility],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  illustrator: "Brian Weisz",
  number: 10,
  set: "TFC",
  rarity: "super_rare",
};
