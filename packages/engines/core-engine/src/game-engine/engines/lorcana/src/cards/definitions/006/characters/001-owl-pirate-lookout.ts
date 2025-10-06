import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const owlPirateLookout: LorcanaCharacterCardDefinition = {
  id: "bc1",
  missingTestCase: true,
  name: "Owl",
  title: "Pirate Lookout",
  characteristics: ["storyborn", "ally", "pirate"],
  text: "WELL SPOTTED During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
  type: "character",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "Well Spotted",
      text: "During your turn, whenever a card is put into your inkwell, chosen opposing character gets -1 {S} until the start of your next turn.",
      conditions: [{ type: "during-turn", value: "self" }],
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 1,
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: chosenOpposingCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Omar Lozano",
  number: 1,
  set: "006",
  rarity: "uncommon",
};
