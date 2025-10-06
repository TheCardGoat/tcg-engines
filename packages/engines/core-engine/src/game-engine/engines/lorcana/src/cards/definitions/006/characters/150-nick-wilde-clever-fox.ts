// TODO: Once the set is released, we organize the cards by set and type

import { haveItemInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nickWildeCleverFox: LorcanaCharacterCardDefinition = {
  id: "b7c",
  name: "Nick Wilde",
  title: "Sly Fox",
  characteristics: ["floodborn", "ally"],
  text: "Shift 1 (You may pay 1 {I} to play this on top of one of your characters named Nick Wilde.)\nCAN'T TOUCH ME While you have an item in play, this character can't be challenged.",
  type: "character",
  abilities: [
    shiftAbility(1, "Nick Wilde"),
    whileConditionThisCharacterGains({
      name: "Can't Touch Me",
      text: "While you have an item in play, this character can't be challenged.",
      conditions: [haveItemInPlay],
      ability: {
        type: "static",
        ability: "effects",
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
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "João Moura",
  number: 150,
  set: "006",
  rarity: "uncommon",
};
