// TODO: Once the set is released, we organize the cards by set and type

import { anyNumberOfYourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  moveToLocation,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const moanaKakamoraLeader: LorcanaCharacterCardDefinition = {
  id: "j0b",
  name: "Moana",
  title: "Kakamora Leader",
  characteristics: ["floodborn", "hero", "princess", "pirate", "captain"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Moana.)\nGATHERING FORCES When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
  type: "character",
  abilities: [
    shiftAbility(5, "Moana"),
    {
      type: "resolution",
      name: "Gathering Forces",
      text: "When you play this character, you may move any number of your characters to the same location for free. Gain 1 lore for each character you moved.",
      optional: true,
      effects: [
        {
          ...moveToLocation(anyNumberOfYourCharacters),
          forEach: [youGainLore(1)],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 1,
  illustrator: "Jared Mathews",
  number: 121,
  set: "006",
  rarity: "rare",
};
