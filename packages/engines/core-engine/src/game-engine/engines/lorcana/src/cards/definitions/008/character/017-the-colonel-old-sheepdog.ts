import { have3orMorePuppiesInPlay } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theColonelOldSheepdog: LorcanaCharacterCardDefinition = {
  id: "xi2",
  missingTestCase: true,
  name: "The Colonel",
  title: "Old Sheepdog",
  characteristics: ["storyborn", "ally"],
  text: "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "WE'VE GOT 'EM OUTNUMBERED",
      text: "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
      conditions: [have3orMorePuppiesInPlay],
      // @ts-ignore
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
        {
          type: "attribute",
          attribute: "lore",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 3,
  willpower: 6,
  illustrator: "Mariana Moreno",
  number: 17,
  set: "008",
  rarity: "rare",
  lore: 1,
};
