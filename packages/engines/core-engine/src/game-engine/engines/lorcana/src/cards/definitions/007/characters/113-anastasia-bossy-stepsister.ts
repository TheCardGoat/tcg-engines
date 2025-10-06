import { discardACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const anastasiaBossyStepsister: LorcanaCharacterCardDefinition = {
  id: "k8t",
  name: "Anastasia",
  title: "Bossy Stepsister",
  characteristics: ["storyborn", "ally"],
  text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
  type: "character",
  abilities: [
    whenChallenged({
      name: "OH, I HATE THIS!",
      text: "Whenever this character is challenged, the challenging player chooses and discards a card.",
      responder: "opponent",
      effects: [discardACard],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 3,
  willpower: 1,
  illustrator: "Iliana Hidajat",
  number: 113,
  set: "007",
  rarity: "uncommon",
  lore: 2,
};
