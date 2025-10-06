import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanDisguisedSoldier: LorcanaCharacterCardDefinition = {
  id: "xrb",
  name: "Mulan",
  title: "Disguised Soldier",
  characteristics: ["storyborn", "hero", "princess"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  strength: 2,
  willpower: 1,
  illustrator: "Jochem van Gool",
  number: 193,
  set: "007",
  rarity: "common",
  lore: 1,
  text: "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
  abilities: [
    whenYouPlayThisCharacter({
      ...youMayDrawThenChooseAndDiscard,
      name: "WHERE DO I SIGN IN?",
      text: "When you play this character, you may draw a card, then choose and discard a card.",
    }),
  ],
};
