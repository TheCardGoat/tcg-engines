import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  anotherChosenCharacterTarget,
  chosenCharacterOfYoursTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const teethAndAmbitions: LorcanaActionCardDefinition = {
  id: "dvr",
  name: "Teeth and Ambitions",
  characteristics: ["action", "song"],
  text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
  type: "action",
  flavour:
    "Of course, quid pro quo, you're expected \nTo take certain duties on board",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Jake Parker",
  number: 130,
  set: "ROF",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
      effects: [
        dealDamageEffect({
          targets: [chosenCharacterOfYoursTarget],
          value: 2,
          followedBy: dealDamageEffect({
            targets: [anotherChosenCharacterTarget],
            value: 2,
          }),
        }),
      ],
    },
  ],
};
