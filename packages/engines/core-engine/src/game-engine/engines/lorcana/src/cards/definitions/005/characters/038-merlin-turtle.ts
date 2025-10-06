import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinTurtle: LorcanaCharacterCardDefinition = {
  id: "h8i",
  missingTestCase: true,
  name: "Merlin",
  title: "Turtle",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**GIVE ME TIME TO THINK** When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  type: "character",
  abilities: whenPlayAndWhenLeaves({
    name: "Give me time to think",
    text: "When you play this character and when he leaves play, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
    effects: [putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck],
  }),
  flavour: "Don't rush me, now—this is important.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Andrea Femerstrand",
  number: 38,
  set: "SSK",
  rarity: "common",
};
