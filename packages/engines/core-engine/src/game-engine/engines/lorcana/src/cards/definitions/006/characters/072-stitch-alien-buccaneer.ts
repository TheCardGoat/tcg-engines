// TODO: Once the set is released, we organize the cards by set and type

import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchAlienBuccaneer: LorcanaCharacterCardDefinition = {
  id: "hzt",
  missingTestCase: true,
  name: "Stitch",
  title: "Alien Buccaneer",
  characteristics: ["hero", "floodborn", "alien", "pirate"],
  text: "**READY FOR ACTION** _When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck._",
  type: "character",
  abilities: [
    shiftAbility(3, "Stitch"),
    {
      type: "resolution",
      name: "READY FOR ACTION",
      resolutionConditions: [{ type: "resolution", value: "shift" }],
      optional: true,
      text: "When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck._",
      effects: [
        {
          type: "move",
          to: "deck",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "zone", value: "discard" },
              { filter: "type", value: "action" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  illustrator: "Cristian Romero",
  number: 72,
  set: "006",
  rarity: "rare",
};
