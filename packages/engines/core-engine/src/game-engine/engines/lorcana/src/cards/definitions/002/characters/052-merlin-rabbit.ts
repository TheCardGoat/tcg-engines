import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinRabbit: LorcanitoCharacterCardDefinition = {
  id: "n83",

  name: "Merlin",
  title: "Rabbit",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**HOPPITY HIP!** When you play this character and when he leaves play, you may draw a card.",
  type: "character",
  abilities: whenPlayAndWhenLeaves({
    name: "Hoppity Hip!",
    text: "When you play this character and when he leaves play, you may draw a card.",
    optional: true,
    effects: [
      {
        type: "draw",
        amount: 1,
        target: self,
      },
    ],
  }),
  flavour: "It was turning out to be a bad hare day.",
  colors: ["amethyst"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Michaela Martin",
  number: 52,
  set: "ROF",
  rarity: "rare",
};
