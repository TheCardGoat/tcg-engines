import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yelanaNorthuldraLeader: LorcanaCharacterCardDefinition = {
  id: "x54",
  name: "Yelana",
  title: "Northuldra Leader",
  characteristics: ["storyborn", "ally"],
  text: "WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "WE ONLY TRUST NATURE",
      text: "When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
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
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 3,
  illustrator: "Aisha Dumgambetova",
  number: 55,
  set: "008",
  rarity: "common",
  lore: 2,
};
