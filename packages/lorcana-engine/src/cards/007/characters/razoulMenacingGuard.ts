import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { chosenItem } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { mayBanish } from "@lorcanito/lorcana-engine/effects/effects";

const myOrdersComeFromJafar = whenYouPlayThisCharacter({
  name: "MY ORDERS COME FROM JAFAR",
  text: "When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
  conditions: [ifYouHaveCharacterNamed("Jafar")],
  optional: true,
  effects: [mayBanish(chosenItem)],
});

export const razoulMenacingGuard: LorcanitoCharacterCard = {
  id: "awb",
  name: "Razoul",
  title: "Menacing Guard",
  characteristics: ["dreamborn", "ally", "captain"],
  text: "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
  type: "character",
  abilities: [myOrdersComeFromJafar],
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 3,
  illustrator: "Carlos Luzzi",
  number: 189,
  set: "007",
  rarity: "common",
  lore: 1,
};
