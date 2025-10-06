import { getStrengthThisChallenge } from "@lorcanito/lorcana-engine/effects/effects";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const louieOneCoolDuck: LorcanaCharacterCardDefinition = {
  id: "hxc",
  name: "Louie",
  title: "One Cool Duck",
  characteristics: ["storyborn", "ally"],
  text: "SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.",
  type: "character",
  abilities: [
    whenChallenged({
      name: "SPRING THE TRAP",
      text: "While this character is being challenged, the challenging character gets -1 {S}.",
      effects: [
        getStrengthThisChallenge(-1, {
          type: "card",
          value: "all",
          filters: [{ filter: "challenge", value: "attacker" }],
        }),
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 3,
  illustrator: "Federico Maria Cugliari",
  number: 1,
  set: "008",
  rarity: "uncommon",
  lore: 2,
};
