import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tritonsDecree: LorcanaActionCardDefinition = {
  id: "lu9",
  missingTestCase: true,
  name: "Triton's Decree",
  characteristics: ["action"],
  text: "Each opponent chooses one of their characters and deals 2 damage to them.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each opponent chooses one of their characters and deals 2 damage to them.",
      responder: "opponent",
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
          value: 2,
        }),
      ],
    },
  ],
  flavour: "Ursula's foul creatures are not welcome in my kingdom!",
  colors: ["steel"],
  cost: 1,
  illustrator: "Carlos Gomes Cabral",
  number: 199,
  set: "URR",
  rarity: "common",
};
