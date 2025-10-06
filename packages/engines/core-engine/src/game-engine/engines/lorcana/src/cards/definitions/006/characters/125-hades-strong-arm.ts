// TODO: Once the set is released, we organize the cards by set and type

import { banishChosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesStrongArm: LorcanaCharacterCardDefinition = {
  id: "q4o",
  name: "Hades",
  title: "Strong Arm",
  characteristics: ["storyborn", "villain", "deity"],
  text: "WHAT ARE YOU GONNA DO? {E}, 3 {I}, Banish one of your characters – Banish chosen character.",
  type: "character",
  abilities: [
    {
      type: "activated",
      costs: [
        { type: "exert" },
        { type: "ink", amount: 3 },
        {
          type: "card",
          action: "banish",
          amount: 1,
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "play" },
            { filter: "type", value: "character" },
          ],
        },
      ],
      name: "What Are You Gonna Do?",
      text: "Banish chosen character.",
      effects: [banishChosenCharacter],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Brian Kesinger",
  number: 125,
  set: "006",
  rarity: "legendary",
};
