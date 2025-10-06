import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const croquetMallet: LorcanaItemCardDefinition = {
  id: "kn8",

  name: "Croquet Mallet",
  characteristics: ["item"],
  text: "**HURTLING HEDGEHOG** Banish this item − Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Hurtling Hedgehog",
      text: "Banish this item − Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "ability",
          ability: "rush",
          amount: 1,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Matt Chapman",
  number: 66,
  set: "ROF",
  rarity: "common",
};
