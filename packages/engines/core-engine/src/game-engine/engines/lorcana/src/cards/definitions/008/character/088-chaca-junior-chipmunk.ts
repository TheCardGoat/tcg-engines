import { chosenOpposingCharacterGainsRecklessDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { ifYouHaveCharacterNamed } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chacaJuniorChipmunk: LorcanaCharacterCardDefinition = {
  id: "wro",
  name: "Chaca",
  title: "Junior Chipmunk",
  characteristics: ["storyborn", "ally"],
  text: "IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "IN CAHOOTS",
      text: "When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
      conditions: [ifYouHaveCharacterNamed("Tipo")],
      effects: [chosenOpposingCharacterGainsRecklessDuringNextTurn],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Florencia Vanzquez",
  number: 88,
  set: "008",
  rarity: "common",
  lore: 1,
};
