import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mauisFishHook: LorcanaItemCardDefinition = {
  id: "ya5",
  name: "Maui's Fish Hook",
  characteristics: ["item"],
  text: "**IT'S MAUI TIME!** If you have a character named Maui in play, you may use this item's Shapeshift ability for free.\n\n\n**SHAPESHIFT** {E}, 2 {I} – Choose one:\n\n· Chosen character gains **Evasive** until the start of your next turn. _(Only characters with Evasive can challenge them.)_\n\n· Chosen character gets +3 {S} this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Shapeshift",
      text: "{E}, 2 {I} – Choose one: Chosen character gains **Evasive** until the start of your next turn. Chosen character gets +3 {S} this turn.",
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "modal",
          // TODO: Get rid of target
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Chosen character gains **Evasive** until the start of your next turn.",
              effects: [
                {
                  type: "ability",
                  ability: "evasive",
                  modifier: "add",
                  duration: "next_turn",
                  until: true,
                  target: chosenCharacter,
                },
              ],
            },
            {
              id: "2",
              text: "Chosen character gets +3 {S} this turn.",
              effects: [
                {
                  type: "attribute",
                  attribute: "strength",
                  amount: 3,
                  modifier: "add",
                  duration: "turn",
                  target: chosenCharacter,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Peter Brockhammer",
  number: 132,
  set: "ITI",
  rarity: "rare",
};
