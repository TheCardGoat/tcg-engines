import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielSingingMermaid: LorcanitoCharacterCardDefinition = {
  id: "q8b",
  reprints: ["vqa"],
  name: "Ariel",
  title: "Singing Mermaid",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**Singer** 7 _(This character counts as cost 7 to sing songs.)_",
  type: "character",
  abilities: [singerAbility(7)],
  flavour: "Watch and you'll see−some day l'Il be part of your world!",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Matthew Robert Davies",
  number: 3,
  set: "URR",
  rarity: "rare",
};
