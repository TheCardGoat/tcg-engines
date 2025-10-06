// TODO: Once the set is released, we organize the cards by set and type

import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { anotherChosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaKumandranRider: LorcanaCharacterCardDefinition = {
  id: "cdg",
  name: "Raya",
  title: "Kumandran Rider",
  characteristics: ["storyborn", "hero", "princess"],
  text: "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Come On, Let's Do This",
      text: "Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
      optional: true,
      oncePerTurn: true,
      conditions: [duringYourTurn],
      effects: readyAndCantQuest(anotherChosenCharacterOfYours),
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Mariana Moreno / Peter Brockhammer",
  number: 107,
  set: "006",
  rarity: "rare",
};
