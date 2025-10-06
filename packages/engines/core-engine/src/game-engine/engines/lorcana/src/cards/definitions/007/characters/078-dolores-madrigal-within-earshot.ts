import { opponentRevealHand } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverOneOfYourCharactersSings } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const doloresMadrigalWithinEarshot: LorcanaCharacterCardDefinition = {
  id: "b3f",
  name: "Dolores Madrigal",
  title: "Within Earshot",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: "I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharactersSings({
      name: "I HEAR YOU",
      text: "Whenever one of your characters sings a song, chosen opponent reveals their hand.",
      effects: [opponentRevealHand],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 1,
  willpower: 2,
  illustrator: "Samantha Erdini",
  number: 78,
  set: "007",
  rarity: "common",
  lore: 1,
};
