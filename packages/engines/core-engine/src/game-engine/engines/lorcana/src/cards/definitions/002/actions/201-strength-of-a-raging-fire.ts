import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const strengthOfARagingFire: LorcanaActionCardDefinition = {
  id: "x5y",

  name: "Strength of a Raging Fire",
  characteristics: ["action", "song"],
  text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nDeal damage to chosen character equal to the number of characters you have in play.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Strength of a Raging Fire",
      text: "Deal damage to chosen character equal to the number of characters you have in play.",
      effects: [
        {
          type: "damage",
          target: chosenCharacter,
          amount: {
            dynamic: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Tranquil as a forest \nBut on fire within",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Jared Nickerl / Alex Accorsi",
  number: 201,
  set: "ROF",
  rarity: "rare",
};
