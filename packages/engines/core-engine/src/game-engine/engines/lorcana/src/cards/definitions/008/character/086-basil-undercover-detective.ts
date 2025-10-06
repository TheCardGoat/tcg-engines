import {
  opponentDiscardsARandomCard,
  returnChosenCharacterToHand,
} from "@lorcanito/lorcana-engine/effects/effects";
import { whenYouPlayThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const basilUndercoverDetective: LorcanaCharacterCardDefinition = {
  id: "w7k",
  name: "Basil",
  title: "Undercover Detective",
  characteristics: ["dreamborn", "hero", "detective"],
  text: "INCAPACITATE When you play this character, you may return chosen character to their player's hand.\nINTERFERE Whenever this character quests, chosen opponent discards a card at random.",
  type: "character",
  abilities: [
    whenYouPlayThisCharacter({
      name: "INCAPACITATE",
      text: "When you play this character, you may return chosen character to their player's hand",
      optional: true,
      effects: [returnChosenCharacterToHand()],
    }),
    wheneverThisCharacterQuests({
      name: "INTERFERE",
      text: "Whenever this character quests, chosen opponent discards a card at random.",
      effects: [opponentDiscardsARandomCard],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 7,
  strength: 5,
  willpower: 4,
  illustrator: "Stefano Spagnuolo",
  number: 86,
  set: "008",
  rarity: "rare",
  lore: 2,
};
