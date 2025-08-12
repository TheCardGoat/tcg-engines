import { putCardEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singTogetherAbility";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const underTheSea: LorcanaActionCardDefinition = {
  id: "s4i",
  name: "Under The Sea",
  characteristics: ["action", "song"],
  text: "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
  type: "action",
  abilities: [
    singerTogetherAbility(8),
    {
      type: "static",
      text: "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
      targets: [
        {
          type: "card",
          cardType: "character",
          owner: "opponent",
          zone: "play",
          count: -1, // All opposing characters with 2 strength or less
          filter: {
            strength: { max: 2 },
          },
        },
      ],
      effects: [
        putCardEffect({
          to: "deck",
          from: "play",
          position: "bottom",
          targets: [
            {
              type: "card",
              cardType: "character",
              owner: "opponent",
              zone: "play",
              count: -1,
              filter: {
                strength: { max: 2 },
              },
            },
          ],
        }),
      ],
    },
  ],
  flavour: "Such wonderful things surround you",
  colors: ["emerald"],
  cost: 8,
  illustrator: "Dylan Bonner",
  number: 95,
  set: "URR",
  rarity: "rare",
};
