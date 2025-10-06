import { singerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cinderellaBallroomSensation: LorcanitoCharacterCardDefinition = {
  id: "rgn",
  name: "Cinderella",
  title: "Ballroom Sensation",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**Singer** 3 _(This character counts as cost 3 to sing songs.)_",
  type: "character",
  abilities: [singerAbility(3)],
  flavour:
    "With a magical dress and a song in her heart, she dazzled everyone at the ball.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Casey Robin",
  number: 3,
  set: "ROF",
  rarity: "rare",
};
