import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  costReductionEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const seekingTheHalfCrown: LorcanaActionCardDefinition = {
  id: "fdo",
  missingTestCase: true,
  name: "Seeking The Half Crown",
  characteristics: ["action"],
  text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
      effects: [
        costReductionEffect({
          targets: [selfPlayerTarget],
          value: {
            type: "count",
            filter: {
              type: "card",
              cardType: "character",
              owner: "self",
              withClassification: "sorcerer",
            },
          } as DynamicValue,
          cardType: "action",
          count: 1,
          duration: THIS_TURN,
        }),
        drawCardEffect({ targets: [selfPlayerTarget], value: 2 }),
      ],
    },
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 5,
  illustrator: "French Carlomagno",
  number: 64,
  set: "006",
  rarity: "rare",
};
