import { allOpposingCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileYouHaveCharactersHere } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

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
