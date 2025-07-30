import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { chosenCharacterTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theMostDiabolicalScheme: LorcanaActionCardDefinition = {
  id: "qad",
  name: "The Most Diabolical Scheme",
  characteristics: ["action", "song"],
  text: "Banish chosen Villain of yours to banish chosen character.",
  type: "action",
  flavour: "New comes the real tour de force \nTricky and wicked, of course",
  colors: ["ruby"],
  cost: 3,
  illustrator: "Carlos Ruiz",
  number: 131,
  set: "ROF",
  rarity: "uncommon",
  abilities: [
    {
      type: "static",
      text: "Banish chosen Villain of yours to banish chosen character.",
      effects: [
        banishEffect({
          targets: [
            {
              type: "card",
              cardType: "character",
              withClassification: "villain",
              owner: "self",
              count: 1,
            },
          ],
          followedBy: banishEffect({ targets: [chosenCharacterTarget] }),
        }),
      ],
    },
  ],
};
