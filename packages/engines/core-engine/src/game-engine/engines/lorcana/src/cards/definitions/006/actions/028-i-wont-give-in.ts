import { returnCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterWithCost2OrLessFromDiscardTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iWontGiveIn: LorcanaActionCardDefinition = {
  id: "ke2",
  missingTestCase: true,
  name: "I Won't Give In",
  characteristics: ["song", "action"],
  text: "(A character with cost 2 or more can {E} to sing this song for free.)\nReturn a character card with cost 2 or less from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Return a character card with cost 2 or less from your discard to your hand.",
      targets: [chosenCharacterWithCost2OrLessFromDiscardTarget],
      effects: [
        returnCardEffect({
          to: "hand",
          from: "discard",
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Natalia Trykowska",
  number: 28,
  set: "006",
  rarity: "common",
};
