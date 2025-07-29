import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const charge: LorcanaActionCardDefinition = {
  id: "koq",
  name: "Charge!",
  characteristics: ["action"],
  text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Charge",
      text: "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
        {
          type: "ability",
          ability: "resist",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour: "Sometimes subtlety is required. This is not one of those times.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Hedvig Häggman-Sund",
  number: 198,
  set: "ROF",
  rarity: "common",
};
