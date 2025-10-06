import type { CardEffectTarget } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const motherKnowsBest: LorcanaActionCardDefinition = {
  id: "rxk",
  reprints: ["px0"],
  name: "Mother Knows Best",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this\nsong for free.)_\nReturn chosen character to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Mother Knows Best",
      text: "Return chosen character to their player's hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "One way or another \nSomething will go wrong, I swear",
  colors: ["emerald"],
  cost: 3,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 95,
  set: "TFC",
  rarity: "uncommon",
};
