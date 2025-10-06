import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";

import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const thePlank: LorcanaItemCardDefinition = {
  id: "xh7",
  name: "The Plank",
  characteristics: ["item"],
  text: "**WALK!** 2 {I}, Banish this item - Choose one:\n· Banish chosen Hero character.\n· Ready chosen Villain character. They can't quest for the rest of this turn.",
  type: "item",
  abilities: [
    {
      name: "WALK!",
      type: "activated",
      text: "2 {I}, Banish this item - Choose one:\n· Banish chosen Hero character.\n· Ready chosen Villain character. They can't quest for the rest of this turn.",
      costs: [{ type: "banish" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "modal",
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Banish chosen Hero character.",
              effects: [
                {
                  type: "banish",
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "type", value: "character" },
                      { filter: "zone", value: "play" },
                      { filter: "characteristics", value: ["hero"] },
                    ],
                  },
                },
              ],
            },
            {
              id: "2",
              text: "Ready chosen Villain character. They can't quest for the rest of this turn.",
              effects: [
                ...readyAndCantQuest({
                  type: "card",
                  value: 1,
                  filters: [
                    { filter: "type", value: "character" },
                    { filter: "zone", value: "play" },
                    { filter: "characteristics", value: ["villain"] },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
  flavour: "It's a once-in-a-lifetime view.",
  colors: ["ruby"],
  cost: 3,
  illustrator: "Roberto Gatto",
  number: 133,
  set: "URR",
  rarity: "common",
};
