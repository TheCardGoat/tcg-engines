import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const vinnieGreenPigeon: LorcanaCharacterCardDefinition = {
  id: "n1g",
  name: "Vinnie",
  title: "Green Pigeon",
  characteristics: ["storyborn"],
  text: "LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
  type: "character",
  abilities: [
    whenYourOtherCharactersIsBanished({
      name: "LEARNING EXPERIENCE",
      text: "During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
      conditions: [{ type: "during-turn", value: "opponent" }],
      effects: [
        {
          type: "lore",
          modifier: "add",
          amount: 1,
          target: self,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["steel"],
  cost: 3,
  strength: 1,
  willpower: 4,
  illustrator: "Cam Kendell",
  number: 194,
  set: "008",
  rarity: "rare",
  lore: 1,
};
