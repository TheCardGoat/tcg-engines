import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gazellePopStar: LorcanaCharacterCardDefinition = {
  id: "y3o",
  name: "Gazelle",
  title: "Pop Star",
  characteristics: ["storyborn", "ally"],
  text: "**Singer 5** _(This character counts as cost 5 to sing songs.)_",
  type: "character",
  abilities: [singerAbility(5)],
  flavour:
    "Good evening, Lorcana! We are here tonight to celebrate the possibilities that open up when we unite.",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Lauren Barger",
  number: 11,
  set: "SSK",
  rarity: "common",
};
