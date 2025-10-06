import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const elsaStormChaser: LorcanaCharacterCardDefinition = {
  id: "m70",
  missingTestCase: true,
  name: "Elsa",
  title: "Storm Chaser",
  characteristics: ["hero", "queen", "sorcerer", "storyborn"],
  text: "**TEMPEST** {E}− Chosen character gains **Challenger** +2 and **Rush** this turn. _(They get +2 {S} while challenging. They can challenge the turn they're played.)_",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "Tempest",
      text: "Chosen character gains **Challenger** +2 and **Rush** this turn.",
      costs: [{ type: "exert" }],
      effects: [
        {
          type: "ability",
          ability: "challenger",
          modifier: "add",
          amount: 2,
          duration: "turn",
          target: chosenCharacter,
        },
        {
          type: "ability",
          ability: "rush",
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "After Elsa dispersed Ursula's storm, Anna was nowhere to be found.",
  colors: ["amethyst"],
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  illustrator: "Mariana Mareno",
  number: 42,
  set: "URR",
  rarity: "rare",
};
