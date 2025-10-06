import {
  chosenItem,
  chosenOpposingCharacter,
} from "@lorcanito/lorcana-engine/abilities/target";
import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aliceAccidentallyAdrift: LorcanaCharacterCardDefinition = {
  id: "rql",
  // notImplemented: true,
  missingTestCase: false,
  name: "Alice",
  title: "Accidentally Adrift",
  characteristics: ["storyborn", "hero"],
  text: "WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.\nMAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
  type: "character",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 2,
  willpower: 3,
  illustrator: "",
  number: 141,
  set: "009",
  rarity: "common",
  abilities: [
    whenYouPlayThisCharacter({
      name: "WASHED AWAY",
      text: "When you play this character, you may put chosen item into its player's inkwell facedown and exerted.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: chosenItem,
        },
      ],
    }),
    wheneverThisCharacterQuests({
      name: "MAKING WAVES",
      text: "Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      effects: [getStrengthThisTurn(-2, chosenOpposingCharacter)],
    }),
  ],
  lore: 2,
};
