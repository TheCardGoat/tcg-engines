import { atTheStartOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import {
  youHaveItemInPlay,
  youHaveLocationInPlay,
} from "@lorcanito/lorcana-engine/abilities/conditions";
import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pachaEmperorsGuide: LorcanitoCharacterCardDefinition = {
  id: "jw7",
  missingTestCase: true,
  name: "Pacha",
  title: "Emperor's Guide",
  characteristics: ["hero", "storyborn"],
  text: "**HELPFUL SUPPLIES** At the start of your turn, if you have an item in play, gain 1 lore. **PERFECT DIRECTIONS** At the start of your turn, if you have a location in play, gain 1 lore.",
  type: "character",
  abilities: [
    atTheStartOfYourTurn({
      name: "Helpful Supplies",
      text: "At the start of your turn, if you have an item in play, gain 1 lore.",
      resolutionConditions: [youHaveItemInPlay],
      effects: [youGainLore(1)],
    }),
    atTheStartOfYourTurn({
      name: "Perfect Directions",
      text: "At the start of your turn, if you have a location in play, gain 1 lore.",
      resolutionConditions: [youHaveLocationInPlay],
      effects: [youGainLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  willpower: 4,
  strength: 0,
  lore: 2,
  illustrator: "Alex Accorsi",
  number: 143,
  set: "SSK",
  rarity: "uncommon",
};
