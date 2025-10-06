import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenDamagedCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const marchHareHareBrainedEccentric: LorcanaCharacterCardDefinition = {
  id: "hvr",
  name: "March Hare",
  title: "Hare-Brained Eccentric",
  characteristics: ["storyborn"],
  text: "LIGHT THE CANDLES When you play this character, you may deal 2 damage to chosen damaged character.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "LIGHT THE CANDLES",
      text: "When you play this character, you may deal 2 damage to chosen damaged character.",
      optional: true,
      effects: [dealDamageEffect(2, chosenDamagedCharacter)],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 3,
  willpower: 4,
  illustrator: "Dustin Panzino",
  number: 91,
  set: "008",
  rarity: "common",
  lore: 1,
};
