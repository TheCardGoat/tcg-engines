import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacterOfYour = {
  type: "card" as const,
  value: 1,
  filters: [
    { filter: "zone" as const, value: "play" as const },
    { filter: "type" as const, value: "character" as const },
    { filter: "owner" as const, value: "self" as const },
  ],
};
const chosenCharacter = {
  type: "card" as const,
  value: 1,
  filters: [
    { filter: "zone" as const, value: "play" as const },
    { filter: "type" as const, value: "character" as const },
  ],
};

export const bounce: LorcanaActionCardDefinition = {
  id: "fpf",
  name: "Bounce",
  characteristics: ["action"],
  text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
      optional: false,
      resolveEffectsIndividually: true,
      dependentEffects: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacterOfYour,
        },
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Are you ready for some bouncing?\n−Tigger",
  colors: ["emerald"],
  cost: 2,
  illustrator: "Bill Robinson",
  number: 97,
  set: "ROF",
  rarity: "uncommon",
};
