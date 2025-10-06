import { whileYouHaveCharacterWithAbility } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const timothyQMouseFlightInstructor: LorcanaCharacterCardDefinition = {
  id: "o6m",
  // notImplemented: true,
  missingTestCase: false,
  name: "Timothy Q. Mouse",
  title: "Flight Instructor",
  characteristics: ["storyborn", "mentor"],
  text: "LET'S SHOW 'EM, DUMBO! While you have a character with Evasive in play, this character gets +1 {L}.",
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 1,
  willpower: 4,
  illustrator: "Grace Tran",
  number: 47,
  set: "009",
  rarity: "common",
  abilities: [
    whileConditionThisCharacterGets({
      name: "LET'S SHOW 'EM, DUMBO!",
      text: "While you have a character with Evasive in play, this character gets +1 {L}.",
      attribute: "lore",
      amount: 1,
      conditions: [whileYouHaveCharacterWithAbility("evasive")],
    }),
  ],
  lore: 1,
};
