import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaFutureKing: LorcanaCharacterCardDefinition = {
  id: "umu",
  name: "Simba",
  title: "Future King",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**GUESS WHAT?** When you play this character, you may draw a card, then choose and discard a card.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      ...youMayDrawThenChooseAndDiscard,
      name: "Guess What?",
      text: "When you play this character, you may draw a card, then choose and discard a card.",
      type: "resolution",
    }),
  ],
  flavour: "I'm gonna be the best king the Pride Lands have ever seen!",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Nicholas Kole",
  number: 188,
  set: "TFC",
  rarity: "common",
};
