import { DURING_THEIR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { drawCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const whenWillMyLifeBegin: LorcanaActionCardDefinition = {
  id: "a04",
  name: "When Will My Life Begin?",
  characteristics: ["action", "song"],
  text: "Chosen character can't challenge during their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen character can't challenge during their next turn. Draw a card.",
      effects: [
        {
          type: "restrict",
          restriction: "challenge",
          duration: DURING_THEIR_NEXT_TURN,
          targets: [chosenCharacterTarget],
        },
        drawCardEffect({ targets: [selfPlayerTarget] }),
      ],
    },
  ],
  flavour: "Stuck in the same place I’ve always been...",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Javi Salas",
  number: 197,
  set: "SSK",
  rarity: "common",
};
