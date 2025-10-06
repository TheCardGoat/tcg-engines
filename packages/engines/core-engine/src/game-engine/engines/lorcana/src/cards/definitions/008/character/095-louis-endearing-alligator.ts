import {
  chosenOpposingCharacterGainsRecklessDuringNextTurn,
  entersPlayExerted,
} from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const louisEndearingAlligator: LorcanaCharacterCardDefinition = {
  id: "hqv",
  name: "Louis",
  title: "Endearing Alligator",
  characteristics: ["storyborn", "ally"],
  text: "SENSITIVE SOUL This character enters play exerted.\nFRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  type: "character",
  abilities: [
    entersPlayExerted({ name: "SENSITIVE SOUL" }),
    whenYouPlayThisCharacter({
      name: "FRIENDLIER THAN HE LOOKS",
      text: "When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      optional: true,
      effects: [chosenOpposingCharacterGainsRecklessDuringNextTurn],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 4,
  willpower: 3,
  illustrator: "Grace Tran",
  number: 95,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
