import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { allOpposingCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lostInTheWoods: LorcanaActionCardDefinition = {
  id: "p0f",
  name: "Lost in the Woods",
  characteristics: ["action", "song"],
  text: "All opposing characters get -2 {S} until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "All opposing characters get -2 {S} until the start of your next turn.",
      targets: [allOpposingCharactersTarget],
      effects: [
        getEffect({
          attribute: "strength",
          value: -2,
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  flavour: "I'm left behind, wondering if I should follow",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  illustrator: "Ellie Horie",
  number: 29,
  set: "URR",
  rarity: "uncommon",
};
