import {
  drawCardEffect,
  putCardEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { targetOwnerTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const youreWelcome: LorcanaActionCardDefinition = {
  id: "tri",
  name: "You're Welcome",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_<br>\nShuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
      targets: [
        {
          type: "card",
          cardType: ["character", "item", "location"],
          zone: "play",
          count: 1,
        },
      ],
      effects: [
        putCardEffect({
          to: "deck",
          from: "play",
          targets: [
            {
              type: "card",
              cardType: ["character", "item", "location"],
              zone: "play",
              count: 1,
            },
          ],
          shuffle: true,
          followedBy: drawCardEffect({
            targets: [targetOwnerTarget],
            value: 2,
          }),
        }),
      ],
    },
  ],
  flavour: "I make everything happen!",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  illustrator: "César Vergara",
  number: 96,
  set: "SSK",
  rarity: "uncommon",
};
