import { THIS_TURN } from "~/game-engine/engines/lorcana/src/abilities/duration";
import { getEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenDamagedCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const whatDidYouCallMe: LorcanaActionCardDefinition = {
  id: "vrt",
  name: "What did you call me?",
  characteristics: ["action"],
  text: "Chosen damaged character gets +3 {S} this turn.",
  type: "action",
  flavour:
    "No one can have a higher opinion of you than I have, and I think you're a slimy, contemptible sewer rat! \n−Basil",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Luis Huerta",
  number: 132,
  set: "ROF",
  rarity: "common",
  abilities: [
    {
      type: "static",
      text: "Chosen damaged character gets +3 {S} this turn.",
      targets: [chosenDamagedCharacterTarget],
      effects: [
        getEffect({
          attribute: "strength",
          value: 3,
          duration: THIS_TURN,
        }),
      ],
    },
  ],
};
