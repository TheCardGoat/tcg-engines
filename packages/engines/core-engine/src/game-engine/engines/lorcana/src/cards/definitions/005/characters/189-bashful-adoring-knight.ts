import { whileYouHaveACharacterNamedThisCharGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { bodyguardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/bodyguardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bashfulAdoringKnight: LorcanitoCharacterCardDefinition = {
  id: "q7u",
  missingTestCase: true,
  name: "Bashful",
  title: "Adoring Knight",
  characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
  text: "**IMPRESS THE PRINCESS** While you have a character named Snow White in play, this character gains **Bodyguard**. _(An opposing character who challenges one of your character must chose one with Bodyguard if able.)_",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGains({
      name: "Impress The Princess",
      text: "While you have a character named Snow White in play, this character gains **Bodyguard**.",
      ability: bodyguardAbility,
      characterName: "snow white",
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Mariana Moreno Ayala",
  number: 189,
  set: "SSK",
  rarity: "uncommon",
};
