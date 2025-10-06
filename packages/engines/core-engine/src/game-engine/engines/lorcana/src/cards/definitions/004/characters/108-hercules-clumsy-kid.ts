import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const herculesClumsyKid: LorcanitoCharacterCardDefinition = {
  id: "gyy",
  name: "Hercules",
  title: "Clumsy Kid",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Rush** _(This character can challenge the turn they're played.)_",
  type: "character",
  abilities: [rushAbility],
  flavour: "Nice Catch, Jerkules. \n–Village boy",
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Antoine Couttolenc",
  number: 108,
  set: "URR",
  rarity: "common",
};
