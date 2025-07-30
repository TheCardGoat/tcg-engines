import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { costReductionEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersInPlayFilter } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const value: DynamicValue = {
  type: "count",
  filter: yourCharactersInPlayFilter,
};

export const zeroToHero: LorcanaActionCardDefinition = {
  id: "uyt",
  name: "Zero To Hero",
  characteristics: ["action", "song"],
  text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
  type: "action",
  colors: ["amber"],
  cost: 2,
  illustrator: "Rob Di Salvo",
  number: 32,
  set: "ROF",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
      targets: [selfPlayerTarget],
      effects: [
        costReductionEffect({
          targets: [selfPlayerTarget],
          value: value,
          cardType: "character",
          count: 1,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
};
