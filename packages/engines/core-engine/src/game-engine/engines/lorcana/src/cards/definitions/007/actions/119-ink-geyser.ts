import { inkwellManagementEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  eachOpponentTarget,
  selfPlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/player-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const inkGeyser: LorcanaActionCardDefinition = {
  id: "jvg",
  name: "Ink Geyser",
  characteristics: ["action"],
  text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
      effects: [
        inkwellManagementEffect({
          targets: [selfPlayerTarget],
          action: "exertAll",
        }),
        inkwellManagementEffect({
          targets: [eachOpponentTarget],
          action: "exertAll",
        }),
        inkwellManagementEffect({
          targets: [selfPlayerTarget],
          action: "conditionalReturn",
          condition: {
            type: "sizeGreaterThan",
            value: 3,
          },
          targetSize: 3,
        }),
        inkwellManagementEffect({
          targets: [eachOpponentTarget],
          action: "conditionalReturn",
          condition: {
            type: "sizeGreaterThan",
            value: 3,
          },
          targetSize: 3,
        }),
      ],
    },
  ],
  inkwell: false,
  colors: ["emerald", "sapphire"],
  cost: 3,
  illustrator: "Kevin Sidharta",
  number: 119,
  set: "007",
  rarity: "rare",
};
