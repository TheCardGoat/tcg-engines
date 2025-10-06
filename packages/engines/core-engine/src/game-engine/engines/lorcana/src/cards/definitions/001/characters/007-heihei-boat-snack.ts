import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heiheiBoatSnack: LorcanitoCharacterCardDefinition = {
  id: "uze",
  name: "Heihei",
  title: "Boat Snack",
  characteristics: ["storyborn", "ally"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour:
    "„Sometimes, our strengths lie beneath the surface.\u0003Far beneath, in some cases. . . .",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Jenna Gray",
  number: 7,
  set: "TFC",
  rarity: "common",
};
