import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { whileYouHaveAnotherXCharacteristicInPlayThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const kakamoraBandOfPirates: LorcanitoCharacterCard = {
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
