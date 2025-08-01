import { chosenPirateCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverYouPlayAnActionNotASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const mrSmeeEfficientCaptain: LorcanitoCharacterCard = {
  id: "at3",
  name: "Mr. Smee",
  title: "Efficient Captain",
  characteristics: ["dreamborn", "villain", "pirate", "captain"],
  text: "PIPE UP THE CREW Whenever you play an action that isn’t a song, you may ready chosen Pirate character.",
  type: "character",
  abilities: [
    wheneverYouPlayAnActionNotASong({
      name: "PIPE UP THE CREW",
      text: "Whenever you play an action that isn’t a song, you may ready chosen Pirate character.",
      optional: true,
      effects: [
        {
          type: "exert",
          exert: false,
          target: chosenPirateCharacter,
        },
      ],
    }),
  ],
  inkwell: false,
  // @ts-expect-error
  color: "",
  colors: ["emerald", "steel"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "João Moura",
  number: 107,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
