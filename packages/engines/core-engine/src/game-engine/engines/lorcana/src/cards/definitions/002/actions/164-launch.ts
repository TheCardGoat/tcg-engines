import {
  banishEffect,
  dealDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  chosenItemTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const launch: LorcanaActionCardDefinition = {
  id: "mu2",

  name: "Launch",
  characteristics: ["action"],
  text: "Banish chosen item of yours to deal 5 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen item of yours to deal 5 damage to chosen character.",
      effects: [
        banishEffect({
          targets: [chosenItemTarget],
          followedBy: dealDamageEffect({
            targets: [chosenCharacterTarget],
            value: 5,
          }),
        }),
      ],
    },
  ],
  flavour: "Ready . . . aim . . . coconut?",
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Juan Diego Leon",
  number: 164,
  set: "ROF",
  rarity: "uncommon",
};
