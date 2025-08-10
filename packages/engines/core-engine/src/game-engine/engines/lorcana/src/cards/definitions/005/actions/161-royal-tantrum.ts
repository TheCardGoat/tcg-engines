import type { DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import {
  banishEffect,
  drawCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { anyNumberOfYourItems } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const royalTantrum: LorcanaActionCardDefinition = {
  id: "v3q",
  name: "Royal Tantrum",
  characteristics: ["action"],
  text: "Banish any number of your items, then draw a card for each item banished this way.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish any number of your items, then draw a card for each item banished this way.",
      effects: [
        banishEffect({
          targets: [anyNumberOfYourItems],
          followedBy: drawCardEffect({
            targets: [selfPlayerTarget],
            value: {
              type: "count",
              previousEffectTargets: true,
            } as DynamicValue,
          }),
        }),
      ],
    },
  ],
  flavour: "I am King! King! King!",
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Michela Cacciatore / Giulia Riva",
  number: 161,
  set: "SSK",
  rarity: "rare",
};
