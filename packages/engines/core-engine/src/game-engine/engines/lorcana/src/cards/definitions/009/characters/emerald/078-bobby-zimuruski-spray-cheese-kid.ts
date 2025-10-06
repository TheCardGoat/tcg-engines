import { youMayDrawThenChooseAndDiscard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bobbyZimuruskiSprayCheeseKid: LorcanaCharacterCardDefinition = {
  id: "wcd",
  missingTestCase: true,
  name: "Bobby Zimuruski",
  title: "Spray Cheese Kid",
  characteristics: ["storyborn", "ally"],
  text: "SO CHEESY When you play this character, you may draw a card, then choose and discard a card.",
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Stefano Spagnuolo",
  number: 78,
  set: "009",
  rarity: "uncommon",
  abilities: [youMayDrawThenChooseAndDiscard],
  lore: 1,
};
