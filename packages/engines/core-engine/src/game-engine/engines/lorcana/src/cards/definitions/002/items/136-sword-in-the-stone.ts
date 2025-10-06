import type { CardEffectTarget } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const swordInTheStone: LorcanaItemCardDefinition = {
  id: "cml",

  name: "Sword In The Stone",
  characteristics: ["item"],
  text: "{E}, 2 {I} - Chosen character gets +1 {S} this turn for each 1 damage on them.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Sword In The Stone",
      text: "{E}, 2 {I} - Chosen character gets +1 {S} this turn for each 1 damage on them.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
          amount: {
            dynamic: true,
            target: { attribute: "damage" },
          },
        },
      ],
    },
  ],
  flavour:
    "Whoso pulleth out this sword of this stone and anvil is rightwise king born of England.",
  colors: ["ruby"],
  cost: 1,
  illustrator: "Gaku Kumatori",
  number: 136,
  set: "ROF",
  rarity: "uncommon",
};
