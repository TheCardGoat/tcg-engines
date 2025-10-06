import type { CardEffectTarget } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacterOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
    { filter: "owner", value: "self" },
  ],
};

export const perplexingSignposts: LorcanaItemCardDefinition = {
  id: "i4b",

  name: "Perplexing Signposts",
  characteristics: ["item"],
  text: "**TO WONDERLAND** Banish this item – Return chosen character of yours to your hand.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "To Wonderland",
      text: "Banish this item – Return chosen character of yours to your hand.",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacterOfYours,
        },
      ],
    },
  ],
  flavour:
    "Alice: I just wanted to ask you which way I ought to go. \nCheshire Cat: Well, that depends on where you want to get to.",
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Andrew Trabbold",
  number: 67,
  set: "ROF",
  rarity: "rare",
};
