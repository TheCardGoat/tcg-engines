import type { AttributeEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const targetingPain: AttributeEffect = {
  type: "attribute",
  attribute: "strength",
  amount: 4,
  modifier: "add",
  duration: "turn",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
      {
        filter: "attribute",
        value: "name",
        comparison: { operator: "eq", value: "pain" },
      },
    ],
  },
};
const notTargetingPain: AttributeEffect = {
  type: "attribute",
  attribute: "strength",
  amount: 2,
  modifier: "add",
  duration: "turn",
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "type", value: "character" },
      { filter: "zone", value: "play" },
    ],
  },
};

export const panicUnderworldImp: LorcanaCharacterCardDefinition = {
  id: "zro",
  name: "Panic",
  title: "Underworld Imp",
  characteristics: ["storyborn", "ally"],
  text: "**I CAN HANDLE IT** When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "I Can Handle It",
      text: "When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
      effects: [
        {
          type: "target-conditional",
          effects: [targetingPain],
          fallback: [notTargetingPain],
          // TODO: Re implement conditional target
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "pain" },
              },
            ],
          },
        },
      ],
    },
  ],
  flavour:
    '"Who says it\'s hard to find good help these days? \\nOh, yeah . . . ME!" \\n−Hades',
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Kristina Chouri / Mariana Moreno",
  number: 87,
  set: "ROF",
  rarity: "common",
};
