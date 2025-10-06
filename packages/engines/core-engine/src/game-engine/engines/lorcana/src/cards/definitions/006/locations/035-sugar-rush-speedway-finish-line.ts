import {
  drawXCards,
  mayBanish,
  youGainLore,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import {
  anyCardTargetYouOwn,
  thisCard,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouMoveACharacterHere } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sugarRushSpeedwayFinishLine: LorcanaLocationCardDefinition = {
  id: "f7t",
  name: "Sugar Rush Speedway",
  title: "Finish Line",
  characteristics: ["location"],
  text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
  type: "location",
  abilities: [
    whenYouMoveACharacterHere({
      name: "Bring It Home, Little One!",
      text: "When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
      optional: true,
      movingFrom: anyCardTargetYouOwn.filters,
      effects: [mayBanish(thisCard), youGainLore(3), drawXCards(3)],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 2,
  willpower: 7,
  moveCost: 6,
  illustrator: "Roberto Gatto",
  number: 35,
  set: "006",
  rarity: "super_rare",
};
