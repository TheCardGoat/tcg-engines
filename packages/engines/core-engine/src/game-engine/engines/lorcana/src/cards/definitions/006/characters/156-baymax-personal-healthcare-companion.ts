// TODO: Once the set is released, we organize the cards by set and type

import { ifYouHaveAnInventor } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { anotherChosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const baymaxPersonalHealthcareCompanion: LorcanaCharacterCardDefinition =
  {
    id: "rk5",
    name: "Baymax",
    title: "Personal Healthcare Companion",
    characteristics: ["hero", "storyborn", "robot"],
    text: "**FULLY CHARGED** If you have an Inventor character in play, you pay 1 {I} less to play this character.\n\n**YOU SAID 'OW'** 2 {I} - Remove up to 1 damage from another chosen character.",
    type: "character",
    abilities: [
      whenYouPlayThisForEachYouPayLess({
        name: "FULLY CHARGED",
        text: "If you have an Inventor character in play, you pay 1 {I} less to play this character.",
        amount: 1,
        conditions: [ifYouHaveAnInventor],
      }),
      {
        type: "activated",
        name: "YOU SAID 'OW'",
        text: "2 {I} - Remove up to 1 damage from another chosen character.",
        costs: [{ type: "ink", amount: 2 }],
        effects: [
          {
            type: "heal",
            amount: 1,
            target: anotherChosenCharacter,
          },
        ],
      },
    ],
    inkwell: true,
    colors: ["sapphire"],
    cost: 3,
    strength: 0,
    willpower: 4,
    lore: 2,
    illustrator: "Jared Mathews",
    number: 156,
    set: "006",
    rarity: "rare",
  };
