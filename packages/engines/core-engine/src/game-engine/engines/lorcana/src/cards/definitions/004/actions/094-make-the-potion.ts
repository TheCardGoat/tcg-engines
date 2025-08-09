import {
  banishEffect,
  dealDamageEffect,
  modalEffect,
} from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import {
  chosenDamagedCharacterTarget,
  chosenItemTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const makeThePotion: LorcanaActionCardDefinition = {
  id: "vwt",
  missingTestCase: true,
  name: "Make the Potion",
  characteristics: ["action"],
  text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
      effects: [
        modalEffect([
          {
            text: "Banish chosen item.",
            effects: [banishEffect({ targets: [chosenItemTarget] })],
          },
          {
            text: "Deal 2 damage to chosen damaged character.",
            effects: [
              dealDamageEffect({
                targets: [chosenDamagedCharacterTarget],
                value: 2,
              }),
            ],
          },
        ]),
      ],
    },
  ],
  colors: ["emerald"],
  cost: 2,
  illustrator: "Elodie Mondoloni",
  number: 94,
  set: "URR",
  rarity: "common",
};
