import { upToValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  getEffect,
  removeDamageEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import {
  allOpposingCharactersTarget,
  anyNumberOfChosenCharacters,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const headsHeldHigh: LorcanaActionCardDefinition = {
  id: "tfh",
  missingTestCase: true,
  name: "Heads Held High",
  characteristics: ["action", "song"],
  text: "Sing Together 6\nRemove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
  type: "action",
  abilities: [
    singerTogetherAbility(6),
    {
      type: "static",
      text: "Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
      effects: [
        removeDamageEffect({
          targets: [anyNumberOfChosenCharacters],
          value: upToValue(3),
        }),
        getEffect({
          targets: [allOpposingCharactersTarget],
          attribute: "strength",
          value: -3,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  illustrator: "Lorenza Pigliamosche / Livio Cacciatore",
  number: 175,
  set: "008",
  rarity: "rare",
};
