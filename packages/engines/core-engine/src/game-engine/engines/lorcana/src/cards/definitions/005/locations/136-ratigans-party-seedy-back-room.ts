import { whileConditionThisCharacterGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ratigansPartySeedyBackRoom: LorcanaLocationCardDefinition = {
  id: "dq2",
  missingTestCase: true,
  name: "Ratigan's Party",
  title: "Seedy Back Room",
  characteristics: ["location"],
  text: "**MISFITS’ REVELRY** While you have a damaged character here, this location gets +2 {L}.",
  type: "location",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Misfits’ Revelry",
      text: "While you have a damaged character here, this location gets +2 {L}.",
      attribute: "lore",
      amount: 2,
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
          filters: [
            {
              filter: "status",
              value: "damage",
              comparison: { operator: "gte", value: 1 },
            },
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  willpower: 7,
  illustrator: "Jeremy Adams",
  number: 136,
  set: "SSK",
  rarity: "uncommon",
  moveCost: 1,
};
