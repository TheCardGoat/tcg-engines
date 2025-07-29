import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { allCharactersTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bePrepared: LorcanaActionCardDefinition = {
  id: "z06",
  name: "Be Prepared",
  characteristics: ["action", "song"],
  text: "_(A character with cost 7 or more can {E} to sing this\nsong for free.)_\nBanish all characters.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish all characters.",
      targets: [allCharactersTarget],
      effects: [banishEffect()],
    },
  ],
  flavour: "Out teeth and ambitions are bared!",
  colors: ["ruby"],
  cost: 7,
  illustrator: "Jared Nickerl",
  number: 128,
  set: "TFC",
  rarity: "rare",
};
