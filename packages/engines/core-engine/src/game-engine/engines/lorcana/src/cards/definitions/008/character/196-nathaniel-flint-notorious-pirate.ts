import type { PlayConditionAbility } from "~/game-engine/engines/lorcana/src/abilities";
import { youHaveDealtDamageToOpposingCharacterThisTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nathanielFlintNotoriousPirate: LorcanaCharacterCardDefinition = {
  id: "dns",
  name: "Nathaniel Flint",
  title: "Notorious Pirate",
  characteristics: ["storyborn", "villain", "alien", "pirate", "captain"],
  text: "PREDATORY INSTINCT You can't play this character unless an opposing character was damaged this turn.",
  type: "character",
  abilities: [
    {
      type: "play-condition",
      name: "PREDATORY INSTINCT",
      text: "You can't play this character unless an opposing character was damaged this turn.",
      conditions: [youHaveDealtDamageToOpposingCharacterThisTurn],
    } as PlayConditionAbility,
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 3,
  willpower: 3,
  illustrator: "Edu Francisco",
  number: 196,
  set: "008",
  rarity: "rare",
  lore: 2,
};
