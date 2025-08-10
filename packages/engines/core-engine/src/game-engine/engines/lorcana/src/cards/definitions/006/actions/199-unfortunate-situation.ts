import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { eachOpponentTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const unfortunateSituation: LorcanaActionCardDefinition = {
  id: "wcu",
  missingTestCase: true,
  name: "Unfortunate Situation",
  characteristics: ["action"],
  text: "Each opponent chooses one of their characters and deals 4 damage to them.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent chooses one of their characters and deals 4 damage to them.",
      targets: [eachOpponentTarget],
      effects: [
        dealDamageEffect({
          targets: [
            {
              type: "card",
              cardType: "character",
              owner: "self",
              count: 1,
            },
          ],
          value: 4,
        }),
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  illustrator: "Mariano Moreno",
  number: 199,
  set: "006",
  rarity: "uncommon",
};
