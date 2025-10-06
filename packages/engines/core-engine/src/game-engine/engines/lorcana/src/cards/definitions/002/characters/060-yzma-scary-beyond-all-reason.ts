import { targetOwnerDrawsXCards } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { anotherChosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaScaryBeyondAllReason: LorcanaCharacterCardDefinition = {
  id: "xdq",
  name: "Yzma",
  title: "Scary Beyond All Reason",
  characteristics: ["floodborn", "sorcerer", "villain"],
  text: "**Shift** 4\n\n**CRUEL IRONY** When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Cruel Irony",
      text: "When you play this character, shuffle another chosen character card into their player's deck. That player draws 2 cards.",
      dependentEffects: true,
      effects: [
        {
          type: "shuffle",
          target: anotherChosenCharacter,
        },
        targetOwnerDrawsXCards(2),
      ],
    },
    shiftAbility(4, "yzma"),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 2,
  illustrator: "Casey Robin",
  number: 60,
  set: "ROF",
  rarity: "super_rare",
};
