import { whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pigletSturdySwordsman: LorcanaCharacterCardDefinition = {
  id: "gau",
  name: "Piglet",
  title: "Sturdy Swordsman",
  characteristics: ["hero", "dreamborn"],
  text: "**Resist +1** _(Damage dealt to this character is reduced by 1.)_\n\n\n**NOT SO SMALL ANYMORE** While you have no cards in your hand, this character can challenge ready characters.",
  type: "character",
  abilities: [
    resistAbility(1),
    whileYouHaveNoCardsInHandThisCharacterCanChallengeReadyChars({
      name: "**NOT SO SMALL ANYMORE**",
      text: "While you have no cards in your hand, this character can challenge ready characters.",
    }),
  ],
  colors: ["steel"],
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 3,
  illustrator: "Alex Accorsi",
  number: 191,
  set: "URR",
  rarity: "legendary",
};
