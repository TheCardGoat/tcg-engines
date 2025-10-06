import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const beastForbiddingRecluse: LorcanitoCharacterCardDefinition = {
  id: "j93",

  name: "Beast",
  title: "Forbidding Recluse",
  characteristics: ["hero", "dreamborn", "prince"],
  text: "**YOU'RE NOT WELCOME HERE** When you play this character, you may deal 1 damage to chosen character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "You're not welcome here",
      text: "When you play this character, you may deal 1 damage to chosen character.",
      optional: true,

      effects: [
        {
          type: "damage",
          amount: 1,
          target: chosenCharacter,
        },
      ],
    },
  ],
  flavour: "Woe to the one who draws his gaze.",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 171,
  set: "ROF",
  rarity: "common",
};
