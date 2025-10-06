import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mickeyMouseStandardBearer: LorcanaCharacterCardDefinition = {
  id: "pqw",
  reprints: ["fax"],
  name: "Mickey Mouse",
  title: "Standard Bearer",
  characteristics: ["hero", "storyborn"],
  text: "**BE STRONG** When you play this character, chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "BE STRONG",
      text: "When you play this character, chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
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
    },
  ],
  flavour: "It is the benchmark for intrepid adventurers around the world.",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Cristian Romero",
  number: 188,
  set: "URR",
  rarity: "common",
};
