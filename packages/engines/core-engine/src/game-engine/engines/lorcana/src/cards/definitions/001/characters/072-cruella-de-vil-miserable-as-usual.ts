import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenChallengedAndBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cruellaDeVilMiserableAsUsual: LorcanaCharacterCardDefinition = {
  id: "wr1",

  name: "Cruella De Vil",
  title: "Miserable As Usual",
  characteristics: ["storyborn", "villain"],
  text: "**You'll Be Sorry** When this character is challenged and banished, you may return chosen character to their player's hand.",
  type: "character",
  abilities: [
    whenChallengedAndBanished({
      name: "YOU'LL BE SORRY",
      text: "When this character is challenged and banished, you may return chosen character to their player's hand.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
      ],
    }),
  ],
  flavour: "When she stops by, misery is company.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Nicholas Kole",
  number: 72,
  set: "TFC",
  rarity: "rare",
};
