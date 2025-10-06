import { anotherChosenCharOfYours } from "@lorcanito/lorcana-engine/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jasmineHeirOfAgrabah: LorcanitoCharacterCardDefinition = {
  id: "tq1",
  reprints: ["cqu"],
  name: "Jasmine",
  title: "Heir of Agrabah",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**I'M A FAST LEARNER** When you play this character, remove up to 1 damage from chosen character of yours.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "I'm a Fast Learner",
      text: "When you play this character, remove up to 1 damage from chosen character of yours.",
      effects: [
        {
          type: "heal",
          amount: 1,
          target: anotherChosenCharOfYours,
        },
      ],
    },
  ],
  flavour: "She may be young, but she's got the spirit of a true leader.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Matthew Robert Davies",
  number: 151,
  set: "ROF",
  rarity: "common",
};
