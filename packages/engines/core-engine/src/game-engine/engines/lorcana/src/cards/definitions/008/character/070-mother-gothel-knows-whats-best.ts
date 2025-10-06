import type {
  CardEffectTarget,
  LorcanaCharacterCardDefinition,
  LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import {
  chosenCharacterGainsChallenger,
  chosenCharacterOfYoursGainsWhenBanishedReturnToHand,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  anotherChosenCharacterOfYours,
  parentsTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";

export const motherGothelKnowsWhatsBest: LorcanaCharacterCardDefinition = {
  id: "pwy",
  name: "Mother Gothel",
  title: "Knows What's Best",
  characteristics: ["storyborn", "villain", "sorcerer"],
  text: "LOOK WHAT YOU'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +1 {S} while challenging.)",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "LOOK WHAT YOU'VE DONE",
      text: "When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and “When this character is banished in a challenge, return this card to your hand” this turn. (They get +1 {S} while challenging.)",
      optional: true,
      effects: [
        {
          type: "damage",
          amount: 2,
          // TODO/NOTE: this character incorrectly shows up in target selection window.
          //  An error appears if this character is selected, though.
          target: anotherChosenCharacterOfYours,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              target: {} as CardEffectTarget, // uses parent target
              effects: [
                {
                  ...chosenCharacterOfYoursGainsWhenBanishedReturnToHand,
                  target: parentsTarget,
                },
                {
                  ...chosenCharacterGainsChallenger(1),
                  target: parentsTarget,
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amethyst", "ruby"],
  cost: 2,
  strength: 1,
  willpower: 3,
  illustrator: "Joel DuQue",
  number: 70,
  set: "008",
  rarity: "rare",
  lore: 1,
};
