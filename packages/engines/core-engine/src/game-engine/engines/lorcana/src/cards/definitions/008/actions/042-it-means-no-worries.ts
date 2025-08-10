import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  costReductionEffect,
  returnCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import { upToTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const itMeansNoWorries: LorcanaActionCardDefinition = {
  id: "u6f",
  name: "It Means No Worries",
  characteristics: ["action", "song"],
  text: "Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)\nReturn up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
  type: "action",
  inkwell: false,
  colors: ["amber"],
  cost: 9,
  illustrator: "Gianluca Barone",
  number: 42,
  set: "008",
  rarity: "rare",
  abilities: [
    singerTogetherAbility(9),
    {
      type: "static",
      text: "Return up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
      effects: [
        returnCardEffect({
          to: "hand",
          from: "discard",
          targets: upToTarget({
            target: {
              type: "card",
              cardType: "character",
              zone: "discard",
              count: 1,
            },
            upTo: 3,
          }),
        }),
        costReductionEffect({
          targets: [selfPlayerTarget],
          value: 2,
          cardType: "character",
          count: 1,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
};
