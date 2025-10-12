import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sebastianCourtComposer: LorcanaCharacterCardDefinition = {
  id: "pj3",

  name: "Sebastian",
  title: "Court Composer",
  characteristics: ["storyborn", "ally"],
  text: "**Singer** 4 _(This character counts as cost 4 to sing songs.)_",
  type: "character",
  abilities: [singerAbility(4)],
  flavour:
    "I should be writing symphonies, not tagging along after some headstrong teenager.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Isaiah Mesq",
  number: 19,
  set: "TFC",
  rarity: "common",
};
