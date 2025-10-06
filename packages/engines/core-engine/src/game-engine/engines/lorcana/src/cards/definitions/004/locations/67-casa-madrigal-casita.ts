import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";
import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";

export const casaMadrigalCasita: LorcanaLocationCardDefinition = {
  id: "x5c",
  reprints: ["jx4"],
  missingTestCase: true,
  name: "Casa Madrigal",
  title: "Casita",
  characteristics: ["location"],
  text: "**OUR HOME** At the start of your turn, if you have a character here, gain 1 lore.",
  type: "location",
  abilities: [
    propertyStaticAbilities({
      name: "Our Home",
      text: "At the start of your turn, if you have a character here, gain 1 lore.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
      ],
      attribute: "lore",
      amount: 1,
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  moveCost: 1,
  willpower: 6,
  illustrator: "Rachel Elese",
  number: 67,
  set: "URR",
  rarity: "common",
};
