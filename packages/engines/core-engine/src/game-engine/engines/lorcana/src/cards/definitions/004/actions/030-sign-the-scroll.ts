import type {
  LorcanitoActionCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  opponent,
} from "@lorcanito/lorcana-engine/abilities/targets";

const abilitySignTheScroll: ResolutionAbility = {
  type: "resolution",
  text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
  responder: "opponent",
  effects: [
    {
      type: "modal",
      // TODO: Get rid of target
      target: chosenCharacter,
      modes: [
        {
          id: "1",
          text: "Discard a card",
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
        {
          id: "2",
          text: "Opponent Gain 2 Lore",
          effects: [
            {
              type: "lore",
              amount: 2,
              modifier: "add",
              target: opponent,
            },
          ],
        },
      ],
    },
  ],
};

export const signTheScroll: LorcanaActionCardDefinition = {
  id: "x7p",
  missingTestCase: true,
  name: "Sign The Scroll",
  characteristics: ["action"],
  text: "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
  type: "action",
  abilities: [abilitySignTheScroll],
  colors: ["amber"],
  cost: 3,
  illustrator: "Mariana Moreno Ayala",
  number: 30,
  set: "URR",
  rarity: "uncommon",
};
