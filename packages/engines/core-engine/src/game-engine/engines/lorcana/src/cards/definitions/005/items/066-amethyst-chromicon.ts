import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

import {
  opponent,
  self,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const amethystChromicon: LorcanaItemCardDefinition = {
  id: "onp",
  missingTestCase: true,
  name: "Amethyst Chromicon",
  characteristics: ["item"],
  text: "**AMETHYST LIGHT** {E} − Each player may draw a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Amethyst Light",
      text: "{E} − Each player may draw a card.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "create-layer-for-player",
          target: self,
          layer: {
            type: "resolution",
            name: "Amethyst Light",
            text: "You may draw a card.",
            optional: true,
            effects: [drawACard],
          },
        },
        {
          type: "create-layer-for-player",
          target: opponent,
          layer: {
            type: "resolution",
            name: "Amethyst Light",
            text: "You may draw a card.",
            optional: true,
            responder: "opponent",
            effects: [drawACard],
          },
        },
      ],
    },
  ],
  flavour: "Seek not power for its own sake.\n–Inscription",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Dustin Panzino",
  number: 66,
  set: "SSK",
  rarity: "uncommon",
};
