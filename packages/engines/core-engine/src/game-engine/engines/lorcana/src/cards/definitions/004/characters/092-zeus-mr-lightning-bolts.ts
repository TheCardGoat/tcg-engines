import {
  chosenCharacter,
  thisCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const zeusMrLightningBolts: LorcanaCharacterCardDefinition = {
  id: "qfh",
  name: "Zeus",
  title: "Mr. Lightning Bolts",
  characteristics: ["storyborn", "king", "deity"],
  text: "**TARGET PRACTICE** Whenever this character challenges another character, he gets + {S} equal to the {S} of chosen character this turn.",
  type: "character",
  abilities: [
    wheneverChallengesAnotherChar({
      name: "Target Practice",
      text: "Whenever this character challenges another character, he gets + {S} equal to the {S} of chosen character this turn.",
      effects: [
        {
          type: "create-layer-based-on-target",
          target: chosenCharacter,
          // TODO: this is workign kind of by accident
          // the dynamic amount from the parent effect forces this amount to be replaced.
          resolveAmountBeforeCreatingLayer: true,
          effects: [
            {
              type: "attribute",
              attribute: "strength",
              modifier: "add",
              target: thisCharacter,
              amount: {
                dynamic: true,
                target: { attribute: "strength" },
              },
            },
          ],
        },
      ],
    }),
  ],
  flavour: "Ha! Now watch your old man work!",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  willpower: 5,
  lore: 2,
  strength: 0,
  illustrator: "Moniek Schilder",
  number: 92,
  set: "URR",
  rarity: "super_rare",
};
