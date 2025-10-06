// TODO: Once the set is released, we organize the cards by set and type

import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gazelleAngelWithHorns: LorcanaCharacterCardDefinition = {
  id: "ra0",
  missingTestCase: true,
  name: "Gazelle",
  title: "Angel with Horns",
  characteristics: ["dreamborn", "ally"],
  text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  type: "character",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          ability: "evasive",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  illustrator: "Wouter Bruneel",
  number: 88,
  set: "006",
  rarity: "common",
};
