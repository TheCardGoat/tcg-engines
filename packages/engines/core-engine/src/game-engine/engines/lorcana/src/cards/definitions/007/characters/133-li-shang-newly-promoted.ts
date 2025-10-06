import { challengeReadyCharacters } from "~/game-engine/engines/lorcana/src/abilities";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileThisCharacterHasDamageGets } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const liShangNewlyPromoted: LorcanaCharacterCardDefinition = {
  id: "scu",
  name: "Li Shang",
  title: "Newly Promoted",
  characteristics: ["storyborn", "hero", "captain"],
  text: "I WON'T LET YOU DOWN This character can challenge ready characters.\nBIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
  type: "character",
  abilities: [
    {
      ...challengeReadyCharacters,
      name: "I WON'T LET YOU DOWN",
      text: "This character can challenge ready characters.",
    },
    whileThisCharacterHasDamageGets({
      name: "BIG RESPONSIBILITY",
      text: "While this character is damaged, he gets +2 {S}.",
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
  inkwell: false,
  colors: ["ruby", "steel"],
  cost: 3,
  strength: 2,
  willpower: 3,
  illustrator: "Ian MacDonald",
  number: 133,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
