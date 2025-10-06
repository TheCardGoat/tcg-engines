import { chosenDamagedCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const banzaiTauntingHyena: LorcanaCharacterCardDefinition = {
  id: "qgg",
  name: "Banzai",
  title: "Taunting Hyena",
  characteristics: ["storyborn", "ally", "hyena"],
  text: "**HERE KITTY, KITTY, KITTY** When you play this character, you may exert chosen damaged character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "HERE KITTY, KITTY, KITTY",
      text: "When you play this character, you may exert chosen damaged character.",
      optional: true,
      effects: [
        {
          type: "exert",
          exert: true,
          target: chosenDamagedCharacter,
        },
      ],
    },
  ],
  flavour: "What do we got here, a little snack pack?",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Alexandria Neonakis",
  number: 87,
  set: "SSK",
  rarity: "common",
};
