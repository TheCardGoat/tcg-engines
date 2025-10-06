import { dealDamageEffect } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayThis } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dumptruckKarnagesSecondMate: LorcanaCharacterCardDefinition = {
  id: "dn9",
  name: "Dumptruck",
  title: "Karnage's Second Mate",
  characteristics: ["storyborn", "ally", "pirate"],
  text: "LET ME AT 'EM When you play this character, you may deal 1 damage to chosen character.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "LET ME AT 'EM",
      text: "When you play this character, you may deal 1 damage to chosen character.",
      optional: true,
      effects: [dealDamageEffect(1, chosenCharacter)],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 1,
  strength: 0,
  willpower: 1,
  illustrator: "Adam Fenton",
  number: 185,
  set: "008",
  rarity: "common",
  lore: 1,
};
