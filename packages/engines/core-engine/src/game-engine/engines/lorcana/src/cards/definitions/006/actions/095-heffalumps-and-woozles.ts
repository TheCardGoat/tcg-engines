import { DURING_THEIR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import {
  drawCardEffect,
  restrictEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenOpposingCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const heffalumpsAndWoozles: LorcanaActionCardDefinition = {
  id: "kml",
  name: "Heffalumps And Woozles",
  characteristics: ["song", "action"],
  text: "Chosen opposing character can't quest during their next turn. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen opposing character can't quest during their next turn. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [
        restrictEffect({
          restriction: "quest",
          duration: DURING_THEIR_NEXT_TURN,
          targets: [chosenOpposingCharacterTarget],
        }),
        drawCardEffect({
          targets: [selfPlayerTarget],
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  illustrator: "Domenico Russo",
  number: 95,
  set: "006",
  rarity: "common",
};
