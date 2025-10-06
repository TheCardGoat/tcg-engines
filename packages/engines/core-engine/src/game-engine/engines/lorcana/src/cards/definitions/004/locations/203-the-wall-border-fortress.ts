import { yourOtherLocations } from "~/game-engine/engines/lorcana/src/abilities/target";
import { thisLocation } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theWallBorderFortress: LorcanaLocationCardDefinition = {
  id: "w4d",
  name: "The Wall",
  title: "Border Fortress",
  characteristics: ["location"],
  text: "**PROTECT THE REALM** While you have an exerted character here, your other locations can't be challenged.",
  type: "location",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Protect the Realm",
      text: "While you have an exerted character here, your other locations can't be challenged.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
          filters: [
            {
              filter: "status",
              value: "exerted",
            },
          ],
        },
      ],
      target: yourOtherLocations,
      gainedAbility: {
        type: "static",
        ability: "effects",
        name: "Protect the Realm",
        text: "While you have an exerted character here, your other locations can't be challenged.",
        effects: [
          {
            type: "restriction",
            restriction: "be-challenged",
            target: thisLocation,
          },
        ],
      },
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  moveCost: 2,
  willpower: 8,
  illustrator: "Jimmy Lo",
  number: 203,
  set: "URR",
  rarity: "rare",
};
