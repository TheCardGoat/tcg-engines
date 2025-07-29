import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cutToTheChase: LorcanaActionCardDefinition = {
  id: "cei",
  name: "Cut to the Chase",
  characteristics: ["action"],
  text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Cut to the Chase",
      text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
      effects: [
        {
          type: "ability",
          ability: "rush",
          modifier: "add",
          duration: "turn",
          until: true,
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  flavour: "Surprise!",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Ellie Horie",
  number: 129,
  set: "TFC",
  rarity: "uncommon",
};
