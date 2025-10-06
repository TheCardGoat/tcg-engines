// TODO: Once the set is released, we organize the cards by set and type

import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const benEccentricRobot: LorcanaCharacterCardDefinition = {
  id: "gn6",
  name: "B.E.N.",
  title: "Eccentric Robot",
  characteristics: ["storyborn", "ally", "robot", "pirate"],
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  type: "character",
  abilities: [supportAbility],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  illustrator: "Grdonvi",
  number: 137,
  set: "006",
  rarity: "common",
};
