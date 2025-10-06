// TODO: Once the set is released, we organize the cards by set and type
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mrLitwakArcadeOwner: LorcanaCharacterCardDefinition = {
  id: "e53",
  missingTestCase: true,
  name: "Mr. Litwak",
  title: "Arcade Owner",
  characteristics: ["storyborn"],
  text: "THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.",
  type: "character",
  abilities: [],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Amanda Duarte / Julio Cesar",
  number: 24,
  set: "006",
  rarity: "common",
};
