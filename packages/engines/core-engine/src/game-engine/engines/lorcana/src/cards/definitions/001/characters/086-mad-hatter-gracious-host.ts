import type { PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import { whenChallenged } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const madHatterGraciousHost: LorcanaCharacterCardDefinition = {
  id: "xw3",

  name: "Mad Hatter",
  title: "Gracious Host",
  characteristics: ["storyborn"],
  text: "**TEA PARTY** Whenever this character is challenged, you may draw a card.",
  type: "character",
  abilities: [
    whenChallenged({
      name: "Tea Party",
      text: "Whenever this character is challenged, you may draw a card.",
      optional: true,
      effects: [
        {
          type: "draw",
          amount: 1,
          target: {
            type: "player",
            value: "self",
          } as PlayerEffectTarget,
        },
      ],
    }),
  ],
  flavour:
    "Mad Hatter: Would you like a little more tea? \nAlice: I haven't had any yet, so I can't very well take more.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 2,
  willpower: 4,
  lore: 3,
  illustrator: "R. La Barbera / L. Giammichele",
  number: 86,
  set: "TFC",
  rarity: "uncommon",
};
