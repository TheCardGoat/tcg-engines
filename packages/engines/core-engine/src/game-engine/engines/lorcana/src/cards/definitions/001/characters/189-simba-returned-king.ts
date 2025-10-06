import {
  challengerAbility,
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const simbaReturnedKing: LorcanaCharacterCardDefinition = {
  id: "hgu",
  name: "Simba",
  title: "Returned King",
  characteristics: ["hero", "storyborn", "king"],
  text: "**Challenger** +4 (While challenging, this character gets\r+4 {S}.)\n**POUNCE** During your turn, this character gains \r**Evasive**. _(They can challenge characters with Evasive.)_",
  type: "character",
  abilities: [
    challengerAbility(4),
    duringYourTurnGains(
      "Pounce",
      "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
      evasiveAbility,
    ),
  ],
  flavour: "„I‘ll do whatever it takes to save my kingdom.",
  inkwell: true,
  colors: ["steel"],
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  illustrator: "Nicholas Kole",
  number: 189,
  set: "TFC",
  rarity: "rare",
};
