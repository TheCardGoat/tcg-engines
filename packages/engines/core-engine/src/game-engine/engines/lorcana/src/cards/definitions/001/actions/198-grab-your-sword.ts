import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { allOpposingCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const grabYourSword: LorcanaActionCardDefinition = {
  id: "u4k",
  name: "Grab Your Sword",
  characteristics: ["action", "song"],
  text: "_(A character with cost 5 or more can {E} to sing this song for free.)_\nDeal 2 damage to each opposing character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Deal 2 damage to each opposing character.",
      targets: [allOpposingCharactersTarget],
      effects: [dealDamageEffect({ value: 2 })],
    },
  ],
  flavour: "We don't like\nwhat we don't understand\nIn fact, it scares us",
  colors: ["steel"],
  cost: 5,
  illustrator: "Peter Brockhammer",
  number: 198,
  set: "TFC",
  rarity: "rare",
};
