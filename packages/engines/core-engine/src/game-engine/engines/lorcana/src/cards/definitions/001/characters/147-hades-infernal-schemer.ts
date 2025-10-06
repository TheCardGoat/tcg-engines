import { chosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesInfernalSchemer: LorcanaCharacterCardDefinition = {
  id: "x36",
  reprints: ["a03"],
  name: "Hades",
  title: "Infernal Schemer",
  characteristics: ["dreamborn", "villain", "deity"],
  text: "**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "Is There a Downside to This?",
      text: "When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  flavour: "He's gotta have a weakness, because everybody's got a weakness.",
  colors: ["sapphire"],
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Matthew Robert Davies",
  number: 147,
  set: "TFC",
  rarity: "legendary",
};
