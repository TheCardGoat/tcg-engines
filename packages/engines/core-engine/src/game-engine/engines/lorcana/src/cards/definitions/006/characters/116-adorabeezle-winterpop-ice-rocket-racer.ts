// TODO: Once the set is released, we organize the cards by set and type

import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileThisCharacterHasDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const adorabeezleWinterpopIceRocketRacer: LorcanaCharacterCardDefinition =
  {
    id: "km9",
    name: "Adorabeezle Winterpop",
    title: "Ice Rocket Racer",
    characteristics: ["storyborn", "hero", "racer"],
    text: "KEEP DRIVING While this character has damage, she gets +1 {L}.",
    type: "character",
    abilities: [
      whileThisCharacterHasDamageGets({
        name: "Keep Driving",
        text: "While this character has damage, she gets +1 {L}.",
        effects: [
          {
            type: "attribute",
            attribute: "lore",
            amount: 1,
            modifier: "add",
            duration: "static",
            target: thisCharacter,
          },
        ],
      }),
    ],
    inkwell: true,
    colors: ["ruby"],
    cost: 3,
    strength: 1,
    willpower: 5,
    lore: 1,
    illustrator: "Cristian Romero",
    number: 116,
    set: "006",
    rarity: "common",
  };
