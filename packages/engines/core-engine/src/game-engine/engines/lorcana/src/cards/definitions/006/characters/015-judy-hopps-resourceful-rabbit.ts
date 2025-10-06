// TODO: Once the set is released, we organize the cards by set and type

import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { readyAnotherChosenCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { supportAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/supportAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const judyHoppsResourcefulRabbit: LorcanitoCharacterCardDefinition = {
  id: "cd4",
  name: "Judy Hopps",
  title: "Resourceful Rabbit",
  characteristics: ["storyborn", "hero"],
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nNEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.",
  type: "character",
  abilities: [
    supportAbility,
    atTheEndOfYourTurn({
      name: "Need Some Help?",
      text: "At the end of your turn, you may ready another chosen character of yours.",
      optional: true,
      effects: [readyAnotherChosenCharacter],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  illustrator: "Lauren Barger",
  number: 15,
  set: "006",
  rarity: "rare",
};
