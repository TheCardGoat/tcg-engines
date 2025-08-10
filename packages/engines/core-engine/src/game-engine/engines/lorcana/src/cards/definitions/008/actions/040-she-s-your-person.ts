import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  modalEffect,
  removeDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  allBodyGuardCharactersTarget,
  chosenCharacterTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const shesYourPerson: LorcanaActionCardDefinition = {
  id: "u6y",
  name: "She's Your Person",
  characteristics: ["action"],
  text: "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
  type: "action",
  inkwell: true,
  colors: ["amber", "steel"],
  cost: 1,
  illustrator: "Sergio Márquez",
  number: 40,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
      effects: [
        modalEffect([
          {
            text: "Remove up to 3 damage from chosen character.",
            effects: [
              removeDamageEffect({
                targets: [chosenCharacterTarget],
                value: upToValue(3),
              }),
            ],
          },
          {
            text: "Remove up to 3 damage from each of your characters with Bodyguard.",
            effects: [
              removeDamageEffect({
                targets: [allBodyGuardCharactersTarget],
                value: upToValue(3),
              }),
            ],
          },
        ]),
      ],
    },
  ],
};
