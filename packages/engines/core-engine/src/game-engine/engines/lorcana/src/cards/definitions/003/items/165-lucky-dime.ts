import { chosenCharacterOfYours } from "~/game-engine/engines/lorcana/src/abilities/target";
import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const luckyDime: LorcanaItemCardDefinition = {
  id: "r2f",
  name: "Lucky Dime",
  characteristics: ["item"],
  text: "**NUMBER ONE** {E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Number one",
      text: "{E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.",
      optional: false,
      costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
      effects: [
        {
          type: "from-target-card-to-target-player",
          player: "card-owner",
          target: chosenCharacterOfYours,
          effects: [
            {
              type: "lore",
              modifier: "add",
              target: self,
              amount: {
                dynamic: true,
                target: { attribute: "lore" },
              },
            },
          ],
        },
      ],
    },
  ],
  flavour: "This one simple coin changed Scrooge's life forever.",
  colors: ["sapphire"],
  cost: 7,
  illustrator: "Leonardo Giammichele",
  number: 165,
  set: "ITI",
  rarity: "legendary",
};
