import { whileYouHaveAnotherCharacterWithCharacteristicThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const annaBravingTheStorm: LorcanitoCharacterCardDefinition = {
  id: "mij",
  reprints: ["ads"],
  missingTestCase: true,
  name: "Anna",
  title: "Braving the Storm",
  characteristics: ["hero", "dreamborn", "queen"],
  text: "**I WAS BORN READY** If you have another Hero character in play, this character gets +1 {L}.",
  type: "character",
  abilities: [
    whileYouHaveAnotherCharacterWithCharacteristicThisCharacterGets({
      name: "I Was Born Ready",
      text: "If you have another Hero character in play, this character gets +1 {L}.",
      amount: 1,
      characteristics: ["hero"],
      minAmount: 2,
    }),
  ],
  flavour:
    "After talking to Olaf, Anna marched into the unexpected storm to save Kristoff.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Maria Dresden",
  number: 137,
  set: "URR",
  rarity: "common",
};
