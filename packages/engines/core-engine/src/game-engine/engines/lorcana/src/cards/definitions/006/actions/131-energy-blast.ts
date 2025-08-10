import {
  banishEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const energyBlast: LorcanaActionCardDefinition = {
  id: "e8s",
  name: "Energy Blast",
  characteristics: ["action"],
  text: "Banish chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish chosen character. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [
        banishEffect({
          targets: [chosenCharacterTarget],
          optional: true,
        }),
        drawCardEffect({
          targets: [selfPlayerTarget],
        }),
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 7,
  strength: 0,
  illustrator: "Marco Giorgini",
  number: 131,
  set: "006",
  rarity: "rare",
};
