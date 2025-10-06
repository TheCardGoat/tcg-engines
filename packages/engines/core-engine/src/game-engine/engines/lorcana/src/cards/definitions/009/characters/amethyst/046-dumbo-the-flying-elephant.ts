import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dumboTheFlyingElephant: LorcanitoCharacterCardDefinition = {
  id: "qcy",
  name: "Dumbo",
  title: "The Flying Elephant",
  characteristics: ["storyborn", "hero"],
  text: "Evasive (Only characters with Evasive can challenge this character.)\nAERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
  type: "character",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 2,
  illustrator: "Sandra Tang",
  number: 46,
  set: "009",
  rarity: "uncommon",
  abilities: [
    evasiveAbility,
    whenYouPlayThisCharacter({
      name: "AERIAL DUO",
      text: "When you play this character, chosen character gains Evasive until the start of your next turn.",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          duration: "next_turn",
          modifier: "add",
          until: true,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  lore: 1,
};
