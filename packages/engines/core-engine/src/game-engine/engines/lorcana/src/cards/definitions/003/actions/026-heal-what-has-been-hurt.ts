import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";

export const healWhatHasBeenHurt: LorcanaActionCardDefinition = {
  id: "ao1",
  name: "Heal What Has Been Hurt",
  characteristics: ["action", "song"],
  text: "_(A character with cost 3 or more can {E} to sing this song for free.)_\n \nRemove up to 3 damage from chosen character. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Heal What Has Been Hurt",
      text: "Remove up to 3 damage from chosen character. Draw a card.",
      resolveEffectsIndividually: true,
      effects: [
        {
          type: "heal",
          amount: 3,
          target: chosenCharacter,
        },
        drawACard,
      ],
    },
  ],
  flavour: "Let your power shine \nMake the clock reverse . . .",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Monica Catalano",
  number: 26,
  set: "ITI",
  rarity: "common",
};
