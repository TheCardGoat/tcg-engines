import { chosenItemOfYours } from "@lorcanito/lorcana-engine/abilities/target";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hiramFlavershamToymaker: LorcanitoCharacterCardDefinition = {
  id: "fap",
  name: "Hiram Flaversham",
  title: "Toymaker",
  characteristics: ["storyborn", "inventor"],
  text: "**ARTIFICER** When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
  type: "character",
  abilities: [
    ...whenPlayAndWheneverQuests({
      name: "Artificer",
      text: "When you play this character and whenever he quests, you may banish one of your items to draw 2 cards.",
      optional: true,
      dependentEffects: true,
      effects: [
        {
          type: "banish",
          target: chosenItemOfYours,
        },
        {
          type: "draw",
          amount: 2,
          target: self,
        },
      ],
    }),
  ],
  flavour:
    "His creations are even more wondrous with the Illuminary's resources at his fingertips.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 1,
  illustrator: "Leonardo Giammichele",
  number: 149,
  set: "ROF",
  rarity: "rare",
};
