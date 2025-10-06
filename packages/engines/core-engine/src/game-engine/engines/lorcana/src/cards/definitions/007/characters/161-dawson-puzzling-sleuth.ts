import { lookAtTopCardOfYourDeckAndPutItOnTopOrBottom } from "@lorcanito/lorcana-engine/effects/effects";
import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dawsonPuzzlingSleuth: LorcanaCharacterCardDefinition = {
  id: "l0i",
  name: "Dawson",
  title: "Puzzling Sleuth",
  characteristics: ["storyborn", "ally", "detective"],
  text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "BE SENSIBLE",
      text: "Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
      oncePerTurn: true,
      conditions: [duringYourTurn],
      effects: [lookAtTopCardOfYourDeckAndPutItOnTopOrBottom],
    }),
  ],
  inkwell: false,
  colors: ["sapphire"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Mario Oscar Gabriele",
  number: 161,
  set: "007",
  rarity: "rare",
  lore: 1,
};
