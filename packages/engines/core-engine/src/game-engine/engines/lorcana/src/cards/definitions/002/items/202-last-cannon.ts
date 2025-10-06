import type {
  AbilityEffect,
  CardEffectTarget,
} from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const lastCannon: LorcanaItemCardDefinition = {
  id: "mbx",

  name: "Last Cannon",
  characteristics: ["item"],
  text: "**ARM YOURSELF** 1 {I}, Banish this item − Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Arm Yourself",
      text: "1 {I}, Banish this item − Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
      costs: [{ type: "banish" }, { type: "ink", amount: 1 }],
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour: "One shot can change everything.",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  illustrator: "Jared Nickerl",
  number: 202,
  set: "ROF",
  rarity: "common",
};
