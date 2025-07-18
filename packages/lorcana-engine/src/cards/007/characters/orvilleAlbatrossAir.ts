import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const orvilleAlbatrossAir: LorcanitoCharacterCard = {
  id: "a0j",
  name: "Orville",
  title: "Albatross Air",
  characteristics: ["storyborn", "ally"],
  text: "WELCOME ABOARD, FOLKS During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive.",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGains({
      name: "Welcome Aboard, Folks",
      text: "During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive.",
      characterName: "Miss Bianca",
      ability: evasiveAbility,
      conditions: [duringYourTurn],
    }),
    whileYouHaveACharacterNamedThisCharGains({
      name: "Welcome Aboard, Folks",
      text: "During your turn, while you have a character named Miss Bianca or Bernard in play, this character gains Evasive.",
      characterName: "Bernard",
      ability: evasiveAbility,
      conditions: [duringYourTurn],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 4,
  willpower: 3,
  illustrator: "Rudy Hill",
  number: 194,
  set: "007",
  rarity: "common",
  lore: 1,
};
