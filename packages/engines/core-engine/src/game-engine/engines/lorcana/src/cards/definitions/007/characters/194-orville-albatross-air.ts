import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { whileYouHaveACharacterNamedThisCharGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const orvilleAlbatrossAir: LorcanaCharacterCardDefinition = {
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
