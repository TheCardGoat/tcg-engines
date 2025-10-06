import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverYouPlayASong } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pjPeteCaughtUpInTheMusic: LorcanaCharacterCardDefinition = {
  id: "pjp",
  // notImplemented: true,
  missingTestCase: false,
  name: "P.J. Pete",
  title: "Caught Up in the Music",
  characteristics: ["storyborn", "ally"],
  text: "SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 3,
  willpower: 5,
  illustrator: "",
  number: 114,
  set: "009",
  rarity: "common",
  abilities: [
    wheneverYouPlayASong({
      name: "SHOUT OUT LOUD!",
      text: "Whenever you play a song, this character gets +2 {S} this turn.",
      effects: [getStrengthThisTurn(2, thisCharacter)],
    }),
  ],
  lore: 1,
};
