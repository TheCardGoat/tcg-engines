import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { chosenCharacterOrLocation } from "~/game-engine/engines/lorcana/src/abilities/targets";

export const treasureMountainAzuriteSeaIsland: LorcanaLocationCardDefinition = {
  id: "nmj",
  name: "Treasure Mountain",
  title: "Azurite Sea Island",
  characteristics: ["location"],
  text: "SECRET WEAPON At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
  type: "location",
  abilities: [
    atTheStartOfYourTurn({
      name: "Secret Weapon",
      text: "At the start of your turn, deal damage to chosen character or location equal to the number of characters here.",
      effects: [
        dealDamageEffect(
          {
            dynamic: true,
            sourceAttribute: "chars-at-location",
          },
          chosenCharacterOrLocation,
        ),
      ],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 5,
  lore: 2,
  willpower: 9,
  illustrator: "Sam Nielson",
  number: 203,
  set: "006",
  rarity: "rare",
  moveCost: 2,
};
