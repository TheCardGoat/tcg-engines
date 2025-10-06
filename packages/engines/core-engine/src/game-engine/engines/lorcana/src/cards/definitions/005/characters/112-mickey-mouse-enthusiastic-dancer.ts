import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileYouHaveACharacterNamedThisCharGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseEnthusiasticDancer: LorcanaCharacterCardDefinition = {
  id: "giv",
  missingTestCase: true,
  name: "Mickey Mouse",
  title: "Enthusiastic Dancer",
  characteristics: ["hero", "dreamborn"],
  text: "**PERFECT PARTNERS** While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
  type: "character",
  abilities: [
    whileYouHaveACharacterNamedThisCharGets({
      name: "Perfect Partners",
      text: "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
      characterName: "Minnie Mouse",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  flavour: "He loves to share the spotlight with a star like Minnie.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Raquel Villanueva",
  number: 112,
  set: "SSK",
  rarity: "common",
};
