import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const jafarAspiringRuler: LorcanaCharacterCardDefinition = {
  id: "t9f",
  name: "Jafar",
  title: "Aspiring Ruler",
  characteristics: ["dreamborn", "villain", "sorcerer"],
  text: "THAT'S BETTER When you play this character, chosen character gains Challenger +2 this turn.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "THAT'S BETTER",
      text: "When you play this character, chosen character gains Challenger +2 this turn.",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 2,
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 3,
  willpower: 2,
  illustrator: "César Vergara",
  number: 190,
  set: "007",
  rarity: "common",
  lore: 2,
};
