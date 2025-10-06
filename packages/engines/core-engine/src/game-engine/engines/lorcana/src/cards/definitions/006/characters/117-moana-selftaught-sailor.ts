// TODO: Once the set is released, we organize the cards by set and type

import { dontHaveCaptainInPlay } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const moanaSelftaughtSailor: LorcanaCharacterCardDefinition = {
  id: "hpk",
  name: "Moana",
  title: "Self-Taught Sailor",
  characteristics: ["dreamborn", "hero", "princess", "pirate"],
  text: "LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Learning the Ropes",
      text: "This character can't challenge unless you have a Captain character in play.",
      conditions: [dontHaveCaptainInPlay],
      effects: [
        {
          type: "restriction",
          restriction: "challenge",
          duration: "static",
          target: thisCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Koni",
  number: 117,
  set: "006",
  rarity: "common",
};
