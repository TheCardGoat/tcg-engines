import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mirabelMadrigalProphecyFinder: LorcanitoCharacterCardDefinition = {
  id: "oqf",
  name: "Mirabel Madrigal",
  title: "Prophecy Finder",
  characteristics: ["hero", "storyborn", "madrigal"],
  text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
  type: "character",
  abilities: [supportAbility],
  flavour:
    "Why would Bruno break this prophecy? Could it be something dangerous? We have to find out!",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Samantha Erdini",
  number: 19,
  set: "URR",
  rarity: "common",
};
