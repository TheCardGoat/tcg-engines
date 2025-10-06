import { putDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dormouseEasilyAgitated: LorcanaCharacterCardDefinition = {
  id: "vud",
  name: "Dormouse",
  title: "Easily Agitated",
  characteristics: ["storyborn"],
  text: "VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "VERY RUDE INDEED",
      text: "When you play this character, you may put 1 damage counter on chosen character.",
      optional: true,
      effects: [putDamageEffect(1, chosenCharacter)],
    }),
  ],
  inkwell: true,
  colors: ["emerald", "ruby"],
  cost: 2,
  strength: 1,
  willpower: 2,
  illustrator: "Joel DuQue",
  number: 103,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
