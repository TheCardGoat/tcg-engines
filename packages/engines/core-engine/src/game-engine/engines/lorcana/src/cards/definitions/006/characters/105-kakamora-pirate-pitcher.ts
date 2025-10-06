// TODO: Once the set is released, we organize the cards by set and type

import { chosenPirateCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kakamoraPiratePitcher: LorcanaCharacterCardDefinition = {
  id: "f6t",
  name: "Kakamora",
  title: "Pirate Pitcher",
  characteristics: ["storyborn", "pirate"],
  text: "DIZZYING SPEED When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Dizzying Speed",
      text: "When you play this character, chosen Pirate character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenPirateCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Saulo Nate",
  number: 105,
  set: "006",
  rarity: "common",
};
