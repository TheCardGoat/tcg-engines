// TODO: Once the set is released, we organize the cards by set and type

import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const bellwetherAssistantMayor: LorcanaCharacterCardDefinition = {
  id: "aom",
  missingTestCase: true,
  name: "Bellwether",
  title: "Assistant Mayor",
  characteristics: ["storyborn", "villain"],
  text: "FEAR ALWAYS WORKS During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Fear Always Works",
      text: "During your turn, whenever a card is put into your inkwell, chosen opposing character gains Reckless during their next turn.",
      conditions: [duringYourTurn],
      effects: [
        {
          type: "ability",
          ability: "reckless",
          modifier: "add",
          duration: "next_turn",
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Samoldstoree",
  number: 90,
  set: "006",
  rarity: "uncommon",
};
