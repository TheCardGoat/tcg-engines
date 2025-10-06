import { chosenOpposingCharacterCantQuestNextTurn } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rapunzelHighClimber: LorcanaCharacterCardDefinition = {
  id: "x5i",
  name: "Rapunzel",
  title: "High Climber",
  characteristics: ["dreamborn", "hero", "princess"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWRAPPED UP Whenever this character quests, chosen opposing character can't quest during their next turn.",
  type: "character",
  abilities: [
    evasiveAbility,
    wheneverThisCharacterQuests({
      name: "WRAPPED UP",
      text: "Whenever this character quests, chosen opposing character can't quest during their next turn.",
      effects: [chosenOpposingCharacterCantQuestNextTurn],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 2,
  willpower: 5,
  illustrator: "Alice Pisoni",
  number: 101,
  set: "008",
  rarity: "legendary",
  lore: 2,
};
