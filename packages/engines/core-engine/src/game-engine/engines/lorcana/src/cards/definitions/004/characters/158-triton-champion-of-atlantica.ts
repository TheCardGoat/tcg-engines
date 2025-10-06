import { opposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tritonChampionOfAtlantica: LorcanitoCharacterCardDefinition = {
  id: "igf",
  missingTestCase: true,
  name: "Triton",
  title: "Champion of Atlantica",
  characteristics: ["floodborn", "king"],
  text: "**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Triton.)_\n\n\n**IMPOSING PRESENCE** Opposing characters get -1 {S} for each location you have in play.",
  type: "character",
  abilities: [
    shiftAbility(6, "Triton"),
    {
      type: "static",
      ability: "effects",
      name: "Imposing Presence",
      text: "Opposing characters get -1 {S} for each location you have in play.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: {
            dynamic: true,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "play" },
              { filter: "type", value: "location" },
            ],
          },
          modifier: "subtract",
          target: opposingCharacters,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 9,
  strength: 7,
  willpower: 9,
  lore: 3,
  illustrator: "Erin Shin",
  number: 158,
  set: "URR",
  rarity: "legendary",
};
