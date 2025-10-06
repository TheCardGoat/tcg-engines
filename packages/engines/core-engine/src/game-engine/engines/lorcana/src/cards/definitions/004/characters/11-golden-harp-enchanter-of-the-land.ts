import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const goldenHarpEnchanterOfTheLand: LorcanaCharacterCardDefinition = {
  id: "ph6",
  name: "Golden Harp",
  title: "Enchanter of the Land",
  characteristics: ["storyborn", "ally"],
  text: "**STOLEN AWAY** At the end of your turn, if you didn't play a song this turn, banish this character.",
  type: "character",
  abilities: [
    atTheEndOfYourTurn({
      name: "**STOLEN AWAY**",
      text: "At the end of your turn, if you didn't play a song this turn, banish this character.",
      effects: [
        {
          type: "banish",
          target: thisCharacter,
        },
      ],
      conditions: [
        {
          type: "played-songs",
          value: false,
        },
      ],
    }),
  ],
  flavour: "You'll miss her when she's gone.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 2,
  illustrator: "Andrea Parisi",
  number: 11,
  set: "URR",
  rarity: "rare",
};
