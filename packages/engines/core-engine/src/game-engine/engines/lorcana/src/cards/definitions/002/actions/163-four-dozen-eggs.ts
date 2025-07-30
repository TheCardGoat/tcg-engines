import { UNTIL_START_OF_YOUR_NEXT_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { gainsAbilityEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import { yourCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fourDozenEggs: LorcanaActionCardDefinition = {
  id: "cww",

  name: "Four Dozen Eggs",
  characteristics: ["action", "song"],
  text: "Your characters gain **Resist** +2 until the start of your next turn.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
      targets: [yourCharactersTarget],
      effects: [
        gainsAbilityEffect({
          ability: resistAbility(2),
          duration: UNTIL_START_OF_YOUR_NEXT_TURN,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Jochem Van Gool",
  number: 163,
  set: "ROF",
  rarity: "uncommon",
};
