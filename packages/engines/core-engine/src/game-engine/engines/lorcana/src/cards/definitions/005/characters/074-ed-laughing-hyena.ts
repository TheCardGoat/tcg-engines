import { chosenDamagedCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const edLaughingHyena: LorcanitoCharacterCardDefinition = {
  id: "sgn",
  missingTestCase: true,
  name: "Ed",
  title: "Laughing Hyena",
  characteristics: ["storyborn", "ally", "hyena"],
  text: "**CAUSE A PANIC** When you play this character, you may deal 2 damage to chosen damaged character.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "CAUSE A PANIC",
      text: "When you play this character, you may deal 2 damage to chosen damaged character.",
      optional: true,
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenDamagedCharacter,
        },
      ],
    },
  ],
  flavour: "A-heh, heh, heh, heh, hee, hee, heeeeee.",
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Otto Paredes",
  number: 74,
  set: "SSK",
  rarity: "common",
};
