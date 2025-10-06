// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacterCantChallengeDuringNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const johnSilverShipsCook: LorcanaCharacterCardDefinition = {
  id: "vyq",
  missingTestCase: true,
  name: "John Silver",
  title: "Ship's Cook",
  characteristics: ["storyborn", "villain", "alien", "pirate", "captain"],
  text: "HUNK OF HARDWARE When you play this character, chosen character can't challenge during their next turn.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Hunk of Hardware",
      text: "When you play this character, chosen character can't challenge during their next turn.",
      effects: [chosenCharacterCantChallengeDuringNextTurn],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 181,
  set: "006",
  rarity: "common",
};
