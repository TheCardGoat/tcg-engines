import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverOneOfYourCharactersSings } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const isabelaMadrigalInTheMoment: LorcanaCharacterCardDefinition = {
  id: "z6d",
  name: "Isabela Madrigal",
  title: "In the Moment",
  characteristics: ["dreamborn", "ally", "madrigal"],
  text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharactersSings({
      name: "IM TIRED OF PERFECT",
      text: "Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
      effects: [
        {
          type: "restriction",
          restriction: "be-challenged",
          duration: "next_turn",
          until: true,
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber"],
  cost: 5,
  strength: 3,
  willpower: 3,
  illustrator: "César Vergara",
  number: 25,
  set: "007",
  rarity: "rare",
  lore: 4,
};
