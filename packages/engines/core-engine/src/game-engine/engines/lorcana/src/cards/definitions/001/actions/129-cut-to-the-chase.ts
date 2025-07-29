import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cutToTheChase: LorcanaActionCardDefinition = {
  id: "cei",
  name: "Cut to the Chase",
  characteristics: ["action"],
  text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character gains **Rush** this turn.",
      targets: [chosenCharacterTarget],
      effects: [gainsAbilityEffect({ ability: rushAbility })],
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
