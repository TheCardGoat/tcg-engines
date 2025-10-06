import { opponentLoseLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stabbingtonBrotherWithAPatch: LorcanaCharacterCardDefinition = {
  id: "qq3",
  name: "Stabbington Brother",
  title: "With a Patch",
  characteristics: ["storyborn", "ally"],
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 5,
  strength: 4,
  willpower: 4,
  illustrator: "Saulo Nate",
  number: 128,
  set: "007",
  rarity: "common",
  lore: 1,
  text: "CRIME OF OPPORTUNITY When you play this character, chosen opponent loses 1 lore.",
  abilities: [
    whenYouPlayThisCharacter({
      name: "Crime of Opportunity",
      text: "chosen opponent loses 1 lore.",
      effects: [opponentLoseLore(1)],
    }),
  ],
};
