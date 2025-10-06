import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pinocchioTalkativePuppet: LorcanaCharacterCardDefinition = {
  id: "gkt",

  name: "Pinocchio",
  title: "Talkative Puppet",
  characteristics: ["hero", "storyborn"],
  text: "**TELLING LIES** When you play this character, you may exert chosen opposing character.",
  type: "character",
  abilities: [
    {
      optional: true,
      type: "resolution",
      name: "Telling Lies",
      text: "When you play this character, you may exert chosen opposing character.",
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenOpposingCharacter,
        },
      ],
    },
  ],
  flavour:
    "A lie keeps growing and growing until it's as plain as the nose on your face. \n−Blue Fairy",
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  illustrator: "Juan Diego Leon",
  number: 58,
  set: "ROF",
  rarity: "uncommon",
};
