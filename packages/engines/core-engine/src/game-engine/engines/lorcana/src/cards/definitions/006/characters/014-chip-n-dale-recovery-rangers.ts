// TODO: Once the set is released, we organize the cards by set and type

import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { returnCharacterFromDiscardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chipNDaleRecoveryRangers: LorcanaCharacterCardDefinition = {
  id: "o68",
  name: "Chip 'n' Dale",
  additionalNames: ["Chip", "Dale"],
  title: "Recovery Rangers",
  characteristics: ["floodborn", "hero"],
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Chip or Dale.)\n(This character counts as being named both Chip and Dale.)\nSEARCH AND RESCUE During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
  type: "character",
  abilities: [
    shiftAbility(5, ["Chip", "Dale"]),
    wheneverACardIsPutIntoYourInkwell({
      name: "Search And Rescue",
      text: "During your turn, whenever a card is put into your inkwell, you may return a character card from your discard to your hand.",
      optional: true,
      conditions: [duringYourTurn],
      effects: [returnCharacterFromDiscardToHand],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 3,
  illustrator: "Louis Jones",
  number: 14,
  set: "006",
  rarity: "rare",
};
