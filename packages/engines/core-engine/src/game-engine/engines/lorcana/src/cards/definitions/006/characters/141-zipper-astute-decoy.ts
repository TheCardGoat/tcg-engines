import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import { anotherChosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const zipperAstuteDecoy: LorcanaCharacterCardDefinition = {
  id: "x2n",
  missingTestCase: true,
  name: "Zipper",
  title: "Astute Decoy",
  characteristics: ["storyborn", "ally"],
  text: "Ward (Opponents can't choose this character except to challenge.)\nRUN INTERFERENCE During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  type: "character",
  abilities: [
    wardAbility,
    wheneverACardIsPutIntoYourInkwell({
      name: "Run Interference",
      text: "During your turn, whenever a card is put into your inkwell, another chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
      conditions: [duringYourTurn],
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 1,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: anotherChosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Eri Welli",
  number: 141,
  set: "006",
  rarity: "rare",
};
