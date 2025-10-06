import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { allOpposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileYouHaveCharactersHere } from "@lorcanito/lorcana-engine/abilities/whileAbilities";

export const galacticCouncilChamber: LorcanaLocationCardDefinition = {
  id: "yrd",
  name: "Galactic Council Chamber",
  title: "Courtroom",
  characteristics: ["location"],
  text: "**FEDERATION DECREE** While you have an Alien or Robot character here, this location can’t be challenged.",
  type: "location",
  abilities: [
    whileYouHaveCharactersHere({
      name: "Federation Decree",
      text: "While you have an Alien or Robot character here, this location can’t be challenged.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
          filters: [
            {
              filter: "characteristics",
              value: ["alien", "robot"],
              conjunction: "or",
            },
          ],
        },
      ],
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "protection",
            from: "challenge",
            target: allOpposingCharacters,
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  willpower: 7,
  lore: 1,
  illustrator: "Kaitlin Cuthbertson",
  number: 204,
  set: "006",
  rarity: "common",
  moveCost: 1,
};
