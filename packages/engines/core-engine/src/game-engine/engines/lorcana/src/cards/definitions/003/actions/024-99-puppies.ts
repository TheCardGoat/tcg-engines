import type {
  LorcanitoActionCard,
  LoreEffect,
  Trigger,
} from "@lorcanito/lorcana-engine";
import {
  oneOfYourCharacters,
  self,
} from "@lorcanito/lorcana-engine/abilities/targets";

export const NnPuppies: LorcanitoActionCard = {
  id: "cba",
  name: "99 Puppies",
  characteristics: ["action"],
  text: "Whenever one of your characters quests this turn, gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "floating-triggered",
      duration: "turn",
      trigger: {
        on: "quest",
        target: oneOfYourCharacters,
      } as Trigger,
      layer: {
        type: "resolution",
        effects: [
          {
            type: "lore",
            amount: 1,
            modifier: "add",
            target: self,
          } as LoreEffect,
        ],
      },
    },
  ],
  flavour: "Two, four, six, and three is nine, plus two is 11 . . . \n−Roger",
  colors: ["amber"],
  cost: 5,
  illustrator: "Agnes Christianson",
  number: 24,
  set: "ITI",
  rarity: "uncommon",
};
