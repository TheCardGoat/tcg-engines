import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import { banishChallengingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { gainAbilityWhileHere } from "~/game-engine/engines/lorcana/src/abilities";
import { whenChallengedAndBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";

export const kuzcosPalaceHomeOfTheEmperor: LorcanaLocationCardDefinition = {
  id: "d8d",
  type: "location",
  missingTestCase: true,
  name: "Kuzco's Palace",
  title: "Home of the Emperor",
  characteristics: ["location"],
  text: "**CITY WALLS** Whenever a character is challenged and banished while here, banish the challenging character.",
  abilities: [
    gainAbilityWhileHere({
      name: "City Walls",
      text: "Whenever a character is challenged and banished while here, banish the challenging character.",
      ability: whenChallengedAndBanished({
        name: "City Walls",
        text: "Whenever a character is challenged and banished while here, banish the challenging character.",
        effects: [banishChallengingCharacter],
      }),
    }),
  ],
  flavour: "Sure it's a little small, but also it DOESN'T HAVE A POOL! −Kuzco",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  willpower: 7,
  lore: 1,
  moveCost: 3,
  illustrator: "Andreas Rocha",
  number: 102,
  set: "ITI",
  rarity: "uncommon",
};
