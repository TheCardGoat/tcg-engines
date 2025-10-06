// TODO: Once the set is released, we organize the cards by set and type

import { haveCaptainInPlay } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const donaldDuckFirstMate: LorcanaCharacterCardDefinition = {
  id: "hqe",
  name: "Donald Duck",
  title: "First Mate",
  characteristics: ["dreamborn", "hero", "pirate"],
  text: "CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "Captain On Deck",
      text: "While you have a Captain character in play, this character gets +2 {L}.",
      conditions: [haveCaptainInPlay],
      attribute: "lore",
      amount: 2,
    }),
    {
      type: "static",
      ability: "effects",
      effects: [
        {
          type: "restriction",
          restriction: "quest",
          duration: "static",
          until: true,
          target: thisCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Jochem van Gool",
  number: 80,
  set: "006",
  rarity: "uncommon",
};
