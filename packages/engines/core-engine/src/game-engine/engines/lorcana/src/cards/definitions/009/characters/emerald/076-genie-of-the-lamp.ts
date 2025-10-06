import { whileThisCharacterIsExerted } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import { yourOtherCharacters } from "~/game-engine/engines/lorcana/src/abilities/target";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionOnThisCharacterTargetsGain } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const genieOfTheLamp: LorcanaCharacterCardDefinition = {
  id: "lzg",
  name: "Genie",
  title: "Of the Lamp",
  characteristics: ["dreamborn", "ally"],
  text: "Evasive\nLET'S MAKE SOME MAGIC While this character is exerted, your other characters get +2 {S}.",
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 2,
  willpower: 3,
  illustrator: "Jeanne Plounevez",
  number: 76,
  set: "009",
  rarity: "super_rare",
  abilities: [
    evasiveAbility,
    whileConditionOnThisCharacterTargetsGain({
      name: "LET'S MAKE SOME MAGIC",
      text: "While this character is exerted, your other characters get +2 {S}",
      conditions: [whileThisCharacterIsExerted],
      target: thisCharacter,
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 2,
            modifier: "add",
            duration: "static",
            // until: true,
            target: yourOtherCharacters,
          },
        ],
      },
    }),
  ],
  lore: 2,
};
