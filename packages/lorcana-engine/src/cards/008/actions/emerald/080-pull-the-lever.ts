import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { drawXCards } from "@lorcanito/lorcana-engine/effects/effects";

export const pullTheLever: LorcanitoActionCard = {
  id: "sp7",
  name: "Pull The Lever!",
  characteristics: ["action"],
  text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
  type: "action",
  inkwell: true,
  colors: ["amethyst", "emerald"],
  cost: 3,
  illustrator: "Mario Manzanares",
  number: 80,
  set: "008",
  rarity: "uncommon",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Draw 2 cards.",
              effects: [drawXCards(2)],
            },
            {
              id: "2",
              text: "Each opponent chooses and discards a card.",
              responder: "opponent",
              effects: [
                {
                  type: "discard",
                  amount: 1,
                  target: {
                    type: "card",
                    value: 1,
                    filters: [
                      { filter: "zone", value: "hand" },
                      { filter: "owner", value: "self" },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
