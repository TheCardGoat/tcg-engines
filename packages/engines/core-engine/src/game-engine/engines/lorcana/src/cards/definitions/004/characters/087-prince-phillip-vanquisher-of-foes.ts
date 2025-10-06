import {
  evasiveAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const princePhillipVanquisherOfFoes: LorcanaCharacterCardDefinition = {
  id: "dh6",
  reprints: ["wj7"],
  missingTestCase: true,
  name: "Prince Phillip",
  title: "Vanquisher of Foes",
  characteristics: ["hero", "floodborn", "prince"],
  text: "**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Prince Phillip.)_\n\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**STRIKE TO THE HEART** When you play this character, banish all opposing damaged characters.",
  type: "character",
  abilities: [
    shiftAbility(6, "prince phillip"),
    evasiveAbility,
    {
      type: "resolution",
      name: "Strike To The Heart",
      text: "When you play this character, banish all opposing damaged characters.",
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "type", value: "character" },
              { filter: "owner", value: "opponent" },
              {
                filter: "status",
                value: "damaged",
              },
            ],
          },
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 9,
  lore: 3,
  strength: 6,
  willpower: 6,
  illustrator: "Randy Bishop",
  number: 87,
  set: "URR",
  rarity: "super_rare",
};
