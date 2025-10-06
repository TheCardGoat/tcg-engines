import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPanPiratesBane: LorcanaCharacterCardDefinition = {
  id: "wzh",
  missingTestCase: true,
  name: "Peter Pan",
  title: "Pirate's Bane",
  characteristics: ["hero", "floodborn"],
  text: "**Shift** 4 _(You may pay 4 ink to play this on top of one of your characters named Peter Pan.)_\n\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**YOU'RE NEXT!** Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
  type: "character",
  abilities: [
    shiftAbility(4, "peter pan"),
    evasiveAbility,
    {
      type: "static",
      name: "You're Next!",
      text: "Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
      ability: "effects",
      effects: [
        {
          type: "protection",
          from: "damage",
          as: "attacker",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              {
                filter: "characteristics",
                value: ["pirate"],
              },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Kuya Jaypi",
  number: 120,
  set: "ITI",
  rarity: "rare",
};
