import { readyThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverOppCharIsDamaged } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastRelentless: LorcanaCharacterCardDefinition = {
  id: "ky8",
  name: "Beast",
  title: "Relentless",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**SECOND WIND** Whenever an opposing character is damaged, you may ready this character.",
  type: "character",
  abilities: [
    wheneverOppCharIsDamaged({
      name: "Second Wind",
      text: "Whenever an opposing character is damaged, you may ready this character.",
      optional: true,
      effects: [readyThisCharacter],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  illustrator: "Eri Welli",
  number: 70,
  set: "ROF",
  rarity: "legendary",
};
