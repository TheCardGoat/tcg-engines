import {
  drawCardEffect,
  moveDamageFromEachEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { yourDamagedCharactersFilter } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import { selfPlayerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const everybodysGotAWeakness: LorcanaActionCardDefinition = {
  id: "j44",
  name: "Everybody's Got A Weakness",
  characteristics: ["action"],
  text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
      effects: [
        ...moveDamageFromEachEffect({
          fromFilter: yourDamagedCharactersFilter,
          toTargets: [
            {
              type: "card",
              cardType: "character",
              owner: "opponent",
              count: 1,
            },
          ],
          value: 1,
          followedBy: drawCardEffect({
            targets: [selfPlayerTarget],
            value: {
              type: "count",
              filter: yourDamagedCharactersFilter,
            },
          }),
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  illustrator: "Linh Dang",
  number: 82,
  set: "008",
  rarity: "rare",
};
