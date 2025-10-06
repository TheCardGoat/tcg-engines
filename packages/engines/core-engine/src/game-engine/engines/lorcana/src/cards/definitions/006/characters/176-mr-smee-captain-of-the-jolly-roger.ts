// TODO: Once the set is released, we organize the cards by set and type

import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrSmeeCaptainOfTheJollyRoger: LorcanaCharacterCardDefinition = {
  id: "ebn",
  missingTestCase: true,
  name: "Mr. Smee",
  title: "Captain of the Jolly Roger",
  characteristics: ["floodborn", "villain", "pirate", "captain"],
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mr. Smee.)\nRAISE THE COLORS When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
  type: "character",
  abilities: [
    shiftAbility(4, "Mr. Smee"),
    {
      type: "resolution",
      name: "Raise the Colors",
      text: "When you play this character, you may deal damage to chosen character equal to the number of your other Pirate characters in play.",
      effects: [
        {
          type: "damage",
          target: chosenCharacter,
          amount: {
            dynamic: true,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "characteristics", value: ["pirate"] },
            ],
          },
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Grace Tran",
  number: 176,
  set: "006",
  rarity: "super_rare",
};
