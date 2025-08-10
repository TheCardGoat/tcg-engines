import {
  banishEffect,
  dealDamageEffect,
  modalEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenCharacterTarget,
  chosenItemTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hotPotato: LorcanaActionCardDefinition = {
  id: "uzc",
  missingTestCase: true,
  name: "Hot Potato",
  characteristics: ["action"],
  text: "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
      effects: [
        modalEffect([
          {
            text: "Deal 2 damage to chosen character.",
            effects: [
              dealDamageEffect({
                targets: [chosenCharacterTarget],
                value: 2,
              }),
            ],
          },
          {
            text: "Banish chosen item.",
            effects: [banishEffect({ targets: [chosenItemTarget] })],
          },
        ]),
      ],
    },
  ],
  flavour: '"This is not going to end well." \n−Pleakley',
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  illustrator: "Nicolas Ky",
  number: 195,
  set: "006",
  rarity: "uncommon",
};
