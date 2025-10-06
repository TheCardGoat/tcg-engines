import { readyThisCharacter } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { wheneverOpposingCharIsBanished } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsCapriciousMonarch: LorcanaCharacterCardDefinition = {
  id: "m85",

  name: "Queen of Hearts",
  title: "Capricious Monarch",
  characteristics: ["queen", "storyborn", "villain"],
  text: "**OFF WITH THEIR HEADS!** Whenever an opposing character is banished, you may ready this character.",
  type: "character",
  abilities: [
    wheneverOpposingCharIsBanished({
      name: "Off with their heads!",
      text: "Whenever an opposing character is banished, you may ready this character.",
      optional: true,
      effects: [readyThisCharacter],
    }),
  ],
  flavour: "The fourth Rule of Villainy: Do whatever it takes to get ahead.",
  inkwell: true,
  colors: ["steel"],
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 1,
  illustrator: "Jenna Gray",
  number: 192,
  set: "ROF",
  rarity: "rare",
};
