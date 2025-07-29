import {
  banishEffect,
  dealDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  chosenItemTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const breakAction: LorcanaActionCardDefinition = {
  id: "whn",
  name: "Break",
  characteristics: ["action"],
  text: "Banish chosen item.",
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
  flavour: "No one throws a tantrum like a beast.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  illustrator: "Grace Tran",
  number: 196,
  set: "TFC",
  rarity: "common",
};
