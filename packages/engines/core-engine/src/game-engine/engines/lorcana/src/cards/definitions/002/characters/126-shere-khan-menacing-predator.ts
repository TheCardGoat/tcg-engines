import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverOneOfYourCharChallengesAnotherChar } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const shereKhanMenacingPredator: LorcanitoCharacterCardDefinition = {
  id: "uep",
  reprints: ["nzy"],

  name: "Shere Khan",
  title: "Menacing Predator",
  characteristics: ["storyborn", "villain"],
  text: "**DON'T INSULT MY INTELLIGENCE** Whenever one of your characters challenges another character, gain 1 lore.",
  type: "character",
  abilities: [
    wheneverOneOfYourCharChallengesAnotherChar({
      optional: true,
      name: "Don't Insult My Intelligence",
      text: "Whenever one of your characters challenges another character, gain 1 lore.",
      effects: [youGainLore(1)],
    }),
  ],
  flavour:
    "The sixth Rule of Villainy: Keep your mind sharp and your claws sharper.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "M. Robert Davies / L. Giammichele",
  number: 126,
  set: "ROF",
  rarity: "rare",
};
