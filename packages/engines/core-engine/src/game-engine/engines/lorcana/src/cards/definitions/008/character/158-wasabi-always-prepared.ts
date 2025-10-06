import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const wasabiAlwaysPrepared: LorcanaCharacterCardDefinition = {
  id: "nzq",
  name: "Wasabi",
  title: "Always Prepared",
  characteristics: ["storyborn", "hero", "inventor"],
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 3,
  willpower: 5,
  illustrator: "Jules Dubost",
  number: 158,
  set: "008",
  rarity: "common",
  lore: 2,
};
