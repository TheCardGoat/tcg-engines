import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { exertChosenOpposingCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const peterPanShadowCatcher: LorcanaCharacterCardDefinition = {
  id: "em6",
  missingTestCase: true,
  name: "Peter Pan",
  title: "Shadow Catcher",
  characteristics: ["storyborn", "hero"],
  text: "GOTCHA! During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Gotcha!",
      conditions: [duringYourTurn],
      text: "During your turn, whenever a card is put into your inkwell, exert chosen opposing character.",
      effects: [exertChosenOpposingCharacter],
    }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 4,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Simone Buonfantino",
  number: 58,
  set: "006",
  rarity: "uncommon",
};
