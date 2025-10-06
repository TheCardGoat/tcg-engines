import { readyAndCantQuestOrChallenge } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const svenReindeerSteed: LorcanaCharacterCardDefinition = {
  id: "xe9",
  name: "Sven",
  title: "Reindeer Steed",
  characteristics: ["storyborn", "ally"],
  text: "**REINDEER GAMES** When you play this character, you may ready chosen character. They can’t quest or challenge for the rest of this turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Reindeer Games",
      text: "When you play this character, you may ready chosen character. They can’t quest or challenge for the rest of this turn.",
      optional: true,
      effects: readyAndCantQuestOrChallenge(chosenCharacter),
    },
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Gonzalo Kenny",
  number: 23,
  set: "SSK",
  rarity: "uncommon",
};
