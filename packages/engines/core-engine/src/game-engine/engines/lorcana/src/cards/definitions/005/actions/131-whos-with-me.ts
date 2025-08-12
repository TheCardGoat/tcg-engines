import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const whosWithMe: LorcanaActionCardDefinition = {
  id: "hlq",
  missingTestCase: true,
  name: "Who's With Me?",
  characteristics: ["action"],
  text: "Your characters get +2 {S} this turn. \nWhenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your characters get +2 {S} this turn. \nWhenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
      targets: [yourCharactersTarget],
      effects: [
        getEffect({ attribute: "strength", value: 2, duration: THIS_TURN }),
        // TODO: Requires trigger system for "whenever" challenge effects with Reckless condition
      ],
    },
  ],
  flavour: '"Don\'t forget, the purple unicorn is mine!"',
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Denny Minonne",
  number: 131,
  set: "SSK",
  rarity: "super_rare",
};
