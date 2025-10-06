import {
  challengerAbility,
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const helgaSinclairToughAsNails: LorcanitoCharacterCardDefinition = {
  id: "li7",
  name: "Helga Sinclair",
  title: "Tough as Nails",
  characteristics: ["storyborn", "villain"],
  text: "Challenger +3.\nQUICK REFLEXES During your turn, this character gains Evasive.",
  type: "character",
  abilities: [
    challengerAbility(3),
    duringYourTurnGains(
      "QUICK REFLEXES",
      "During your turn, this character gains **Evasive**.",
      evasiveAbility,
    ),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 2,
  strength: 0,
  willpower: 4,
  illustrator: "Samoldstorre",
  number: 183,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
