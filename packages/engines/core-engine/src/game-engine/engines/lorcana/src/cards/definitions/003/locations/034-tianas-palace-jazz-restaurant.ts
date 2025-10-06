import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";

export const tianasPalaceJazzRestaurant: LorcanaLocationCardDefinition = {
  id: "sfq",
  type: "location",
  name: "Tiana's Palace",
  title: "Jazz Restaurant",
  characteristics: ["location"],
  text: "**NIGHT OUT** Characters can't be challenged while here.",
  abilities: [
    gainAbilityWhileHere({
      name: "Night Out",
      text: "Characters can't be challenged while here.",
      ability: {
        type: "static",
        ability: "effects",
        name: "Night Out",
        text: "Characters can't be challenged while here.",
        effects: [
          {
            type: "restriction",
            restriction: "be-challenged",
            target: thisCharacter,
          },
        ],
      },
    }),
  ],
  flavour: "In New Orleans, dreams can come true.",
  colors: ["amber"],
  cost: 3,
  willpower: 8,
  lore: 1,
  moveCost: 2,
  illustrator: "Valerio Buonfantino",
  number: 34,
  set: "ITI",
  rarity: "uncommon",
};
