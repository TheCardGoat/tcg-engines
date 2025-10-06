import {
  youPayXLessToPlayNextActionThisTurn,
  youPayXLessToPlayNextItemThisTurn,
  youPayXLessToPlayNextLocationThisTurn,
} from "@lorcanito/lorcana-engine/effects/effects";

import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const scroogesTopHat: LorcanaItemCardDefinition = {
  id: "jzq",
  missingTestCase: true,
  name: "Scrooge's Top Hat",
  characteristics: ["item"],
  text: "**BUSINESS EXPERTISE** {E} – Choose one: You pay 1 {I} less to play your next action this turn. You pay 1 {I} less to play your next item this turn. You pay 1 {I} less to play your next location this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "PENNY PINCHER",
      text: "{E} – Choose one: You pay 1 {I} less to play your next action this turn. You pay 1 {I} less to play your next item this turn. You pay 1 {I} less to play your next location this turn.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "modal",
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "You pay 1 {I} less to play your next action this turn.",
              effects: [youPayXLessToPlayNextActionThisTurn(1)],
            },
            {
              id: "2",
              text: "You pay 1 {I} less to play your next item this turn.",
              effects: [youPayXLessToPlayNextItemThisTurn(1)],
            },
            {
              id: "3",
              text: "You pay 1 {I} less to play your next location this turn.",
              effects: [youPayXLessToPlayNextLocationThisTurn(1)],
            },
          ],
        },
      ],
    },
  ],
  flavour: "Just the thing to top off another brilliant deal.",
  colors: ["sapphire"],
  cost: 2,
  illustrator: "Gabriel Angelo",
  number: 166,
  set: "ITI",
  rarity: "uncommon",
};
