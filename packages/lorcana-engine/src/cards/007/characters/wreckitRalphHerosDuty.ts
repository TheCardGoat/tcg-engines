import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { thisCharacterGetsLore } from "@lorcanito/lorcana-engine/effects/effects";

export const wreckitRalphHerosDuty: LorcanitoCharacterCard = {
  id: "ehh",
  name: "Wreck-it Ralph",
  title: "Hero's Duty",
  characteristics: ["storyborn", "hero"],
  text: "OUTFLANK During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
  type: "character",
  abilities: [
    whenYourOtherCharactersIsBanished({
      name: "OUTFLANK",
      text: "During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
      conditions: [duringYourTurn],
      effects: [thisCharacterGetsLore(1)],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 3,
  willpower: 8,
  illustrator: "Erik Wain",
  number: 27,
  set: "007",
  rarity: "rare",
  lore: 1,
};
