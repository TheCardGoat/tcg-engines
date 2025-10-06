// TODO: Once the set is released, we organize the cards by set and type

import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jimHawkinsStubbornCabinBoy: LorcanitoCharacterCardDefinition = {
  id: "geq",
  missingTestCase: true,
  name: "Jim Hawkins",
  title: "Stubborn Cabin Boy",
  characteristics: ["storyborn", "hero"],
  text: "COME HERE, COME HERE, COME HERE! During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Come Here, Come Here, Come Here!",
      text: "During your turn, whenever a card is put into your inkwell, this character gets Challenger +2 this turn. (While challenging, this character gets +2 {S}.)",
      conditions: [duringYourTurn],
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  illustrator: "Ursula Dorada",
  number: 173,
  set: "006",
  rarity: "common",
};
