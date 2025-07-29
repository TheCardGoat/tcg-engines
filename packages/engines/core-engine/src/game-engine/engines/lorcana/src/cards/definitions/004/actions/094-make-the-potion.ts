import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import {
  chosenCharacter,
  chosenDamagedCharacter,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  banishChosenItem,
  dealDamageEffect,
} from "@lorcanito/lorcana-engine/effects/effects";

export const makeThePotion: LorcanaActionCardDefinition = {
  id: "vwt",
  missingTestCase: true,
  name: "Make the Potion",
  characteristics: ["action"],
  text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
      effects: [
        {
          type: "modal",
          target: chosenCharacter,
          modes: [
            {
              id: "1",
              text: "Banish chosen item",
              effects: [banishChosenItem],
            },
            {
              id: "2",
              text: "Deal 2 damage to chosen damaged character",
              effects: [dealDamageEffect(2, chosenDamagedCharacter)],
            },
          ],
        },
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
