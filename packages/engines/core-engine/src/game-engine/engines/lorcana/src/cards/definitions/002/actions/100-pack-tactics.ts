import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import { gainLoreEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { opponentsDamagedCharactersFilter } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const value: DynamicValue = {
  type: "count",
  filter: opponentsDamagedCharactersFilter,
};

export const packTactics: LorcanaActionCardDefinition = {
  id: "yp2",
  name: "Pack Tactics",
  characteristics: ["action"],
  text: "Gain 1 lore for each damaged character opponents have in play.",
  type: "action",
  flavour:
    "Pacha: You want to survive the jungle? Start thinking like you belong here. \nKuzco: No problem . . . Grrr, look at me, I'm a jaguar.",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  illustrator: "Don Aguillo",
  number: 100,
  set: "ROF",
  rarity: "rare",
  abilities: [
    {
      type: "static",
      text: "Gain 1 lore for each damaged character opponents have in play.",
      targets: [selfPlayerTarget],
      effects: [
        gainLoreEffect({
          value: value,
        }),
      ],
    },
  ],
};
