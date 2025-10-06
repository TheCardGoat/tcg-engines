import { whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kakamoraBandOfPirates: LorcanaCharacterCardDefinition = {
  id: "xkp",
  name: "Kakamora",
  title: "Band of Pirates",
  characteristics: ["storyborn", "pirate"],
  text: "SHOWBOATING While you have another Pirate character in play, this character gains Challenger +3.",
  type: "character",
  abilities: [
    whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains({
      name: "SHOWBOATING",
      text: "While you have another Pirate character in play, this character gains Challenger +3.",
      characteristics: ["pirate"],
      ability: challengerAbility(3),
    }),
  ],
  illustrator: "Juan Diego Leon",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  lore: 1,
  strength: 1,
  willpower: 6,
  number: 192,
  set: "007",
  rarity: "common",
};
