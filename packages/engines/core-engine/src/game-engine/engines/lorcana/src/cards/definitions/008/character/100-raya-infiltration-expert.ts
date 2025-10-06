import { readyAnotherChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaInfiltrationExpert: LorcanaCharacterCardDefinition = {
  id: "oql",
  name: "Raya",
  title: "Infiltration Expert",
  characteristics: ["storyborn", "hero", "princess"],
  text: "UNCONVENTIONAL TACTICS Whenever this character quests, you may pay 2 {I} to ready another chosen character.",
  type: "character",
  abilities: [
    wheneverThisCharacterQuests({
      name: "UNCONVENTIONAL TACTICS",
      text: "Whenever this character quests, you may pay 2 {I} to ready another chosen character.",
      optional: true,
      costs: [{ type: "ink", amount: 2 }],
      effects: [readyAnotherChosenCharacter],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 5,
  willpower: 5,
  illustrator: "Dustin Panzino",
  number: 100,
  set: "008",
  rarity: "legendary",
  lore: 2,
};
