import {
  gainLoreEffect,
  loseLoreEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thievery: LorcanaActionCardDefinition = {
  id: "nf0",
  missingTestCase: true,
  name: "Thievery",
  characteristics: ["action"],
  text: "Chosen opponent loses 1 lore. Gain 1 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Chosen opponent loses 1 lore. Gain 1 lore.",
      effects: [
        loseLoreEffect({
          value: 1,
          targets: [chosenOpponentTarget],
        }),
        gainLoreEffect({
          value: 1,
          targets: [selfPlayerTarget],
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Antoine Couttolenc",
  number: 128,
  set: "006",
  rarity: "common",
};
