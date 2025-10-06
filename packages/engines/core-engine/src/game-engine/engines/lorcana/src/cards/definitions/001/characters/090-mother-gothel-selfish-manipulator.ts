import {
  opposingCharacters,
  thisCharacter,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whileConditionOnThisCharacterTargetsGain } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const motherGoethelSelfishManipulator: LorcanitoCharacterCardDefinition =
  {
    id: "opl",
    name: "Mother Gothel",
    title: "Selfish Manipulator",
    characteristics: ["storyborn", "villain"],
    text: "**SKIP THE DRAMA, STAY WITH MAMA** While this character is exerted, opposing character can't quest.",
    type: "character",
    illustrator: "Javier Salas",
    abilities: [
      whileConditionOnThisCharacterTargetsGain({
        name: "Skip the Drama, Stay with Mama",
        text: "While this character is exerted, opposing character can't quest.",
        conditions: [{ type: "exerted" }],
        target: opposingCharacters,
        ability: {
          type: "static",
          ability: "effects",
          target: thisCharacter,
          effects: [
            {
              type: "restriction",
              restriction: "quest",
              duration: "static",
              target: opposingCharacters,
            },
          ],
        },
      }),
    ],
    flavour: "Great. Now I'm the bad guy.",
    inkwell: true,
    colors: ["emerald"],
    cost: 6,
    strength: 3,
    willpower: 6,
    lore: 2,
    number: 90,
    set: "TFC",
    rarity: "super_rare",
  };
