import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";

export const badanonVillainSupportCenter: LorcanaLocationCardDefinition = {
  id: "lvt",
  missingTestCase: true,
  name: "Bad-Anon",
  title: "Villain Support Center",
  characteristics: ["location"],
  text: "**THERE'S NO ONE I'D RATHER BE THAN ME** Villain characters gain {E}, 3 {I} - Play a character with the same name as this character for free\" while here.",
  type: "location",
  abilities: [
    gainAbilityWhileHere({
      name: "THERE'S NO ONE I'D RATHER BE THAN ME",
      text: 'Villain characters gain "{E}, 3 {I} - Play a character with the same name as this character for free" while here.',
      ability: {
        type: "activated",
        name: "THERE'S NO ONE I'D RATHER BE THAN ME",
        text: "{E}, 3 {I} - Play a character with the same name as this character for free",
        costs: [{ type: "exert" }, { type: "ink", amount: 3 }],
        effects: [
          {
            type: "play",
            forFree: true,
            target: {
              type: "card",
              value: 1,
              filters: [
                { filter: "owner", value: "self" },
                { filter: "zone", value: "hand" },
                { filter: "type", value: "character" },
                { filter: "characteristics", value: ["villain"] },
                // TODO: Check if the name is the same
              ],
            },
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  willpower: 7,
  lore: 1,
  illustrator: "Saulo Nate",
  number: 203,
  set: "SSK",
  rarity: "rare",
  moveCost: 1,
};
