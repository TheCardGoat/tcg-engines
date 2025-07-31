import { allOpposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lostInTheWoods: LorcanaActionCardDefinition = {
  id: "p0f",
  name: "Lost in the Woods",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nAll opposing characters get -2 {S} until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: allOpposingCharacters,
        },
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
