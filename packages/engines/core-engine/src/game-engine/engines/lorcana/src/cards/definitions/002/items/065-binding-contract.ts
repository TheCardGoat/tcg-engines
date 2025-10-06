import { exertCharCost } from "~/game-engine/engines/lorcana/src/abilities";
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

export const bindingContract: LorcanaItemCardDefinition = {
  id: "n9a",

  name: "Binding Contract",
  characteristics: ["item"],
  text: "**FOR ALL ETERNITY** {E}, {E} one of your characters − Exert chosen character.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "For All Eternity",
      text: "{E}, {E} one of your characters − Exert chosen character.",
      costs: [{ type: "exert" }, exertCharCost(1)],
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Just a standard form, nothing to worry about.",
  colors: ["amethyst"],
  cost: 4,
  illustrator: "Kasia Brzezinska",
  number: 65,
  set: "ROF",
  rarity: "uncommon",
};
