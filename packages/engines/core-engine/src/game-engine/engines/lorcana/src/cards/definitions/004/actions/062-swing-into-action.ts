import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const swingIntoAction: LorcanaActionCardDefinition = {
  id: "bho",
  name: "Swing Into Action",
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
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Wouter Bruneel",
  number: 62,
  set: "URR",
  rarity: "common",
};
