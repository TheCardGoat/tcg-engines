import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const forestDuel: LorcanaActionCardDefinition = {
  id: "m3x",
  name: "Forest Duel",
  characteristics: ["action"],
  text: "Your characters gain Challenger +2 and 'When this character is banished in a challenge, return this card to your hand' this turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your characters gain Challenger +2 and 'When this character is banished in a challenge, return this card to your hand' this turn.",
      targets: [yourCharactersTarget],
      effects: [
        gainsAbilityEffect({
          targets: [yourCharactersTarget],
          ability: challengerAbility(2),
          duration: THIS_TURN,
        }),
        // TODO: Requires triggered ability system for "when banished in challenge" condition
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  illustrator: "Yr Tanner",
  number: 77,
  set: "008",
  rarity: "uncommon",
};
