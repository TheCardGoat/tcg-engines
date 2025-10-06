import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const olafTrustingCompanion: LorcanitoCharacterCardDefinition = {
  id: "tln",
  name: "Olaf",
  title: "Trusting Companion",
  characteristics: ["storyborn", "ally"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour:
    "Isn't this Kristoff's hat? If he went this way, he'll be caught in that storm!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Brian Kesinger",
  number: 150,
  set: "URR",
  rarity: "common",
};
