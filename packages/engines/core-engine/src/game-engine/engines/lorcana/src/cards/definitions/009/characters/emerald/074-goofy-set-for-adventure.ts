import {
  drawACard,
  moveToLocation,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  chosenCharacterOfYours,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenMovesToALocation } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goofySetForAdventure: LorcanaCharacterCardDefinition = {
  id: "lot",
  // notImplemented: true,
  name: "Goofy",
  title: "Set for Adventure",
  characteristics: ["storyborn", "hero"],
  text: "FAMILY VACATION Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Carlos Ruiz",
  number: 74,
  set: "009",
  rarity: "rare",
  abilities: [
    whenMovesToALocation({
      name: "FAMILY VACATION",
      text: "Once during your turn, whenever this character moves to a location, you may move one of your other characters to that location for free. If you do, draw a card.",
      oncePerTurn: true,
      optional: true,
      effects: [
        {
          ...moveToLocation(chosenCharacterOfYours),
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              // required but not used
              target: thisCharacter,
              effects: [drawACard],
            },
          ],
        },
      ],
    }),
  ],
  lore: 1,
};
