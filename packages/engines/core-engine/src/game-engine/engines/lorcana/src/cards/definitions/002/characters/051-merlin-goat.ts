import { self } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenPlayAndWhenLeaves } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinGoat: LorcanaCharacterCardDefinition = {
  id: "r3h",

  name: "Merlin",
  title: "Goat",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**HERE I COME!** When you play this character and when he leaves play, gain 1 lore.",
  type: "character",
  abilities: whenPlayAndWhenLeaves({
    name: "Here I Come!",
    text: "When you play this character and when he leaves play, gain 1 lore.",
    effects: [
      {
        type: "lore",
        modifier: "add",
        amount: 1,
        target: self,
      },
    ],
  }),
  flavour: "He always was a stubborn old goat.\n–Madam Mim",
  inkwell: true,
  colors: ["amethyst"],
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "S. Shaw / L. Giammichele",
  number: 51,
  set: "ROF",
  rarity: "uncommon",
};
