import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverACardIsPutIntoYourInkwell } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaGuidanceSeeker: LorcanaCharacterCardDefinition = {
  id: "big",
  name: "Raya",
  title: "Guidance Seeker",
  characteristics: ["storyborn", "hero", "princess"],
  type: "character",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 1,
  willpower: 4,
  illustrator: "Maxine Vee",
  number: 186,
  set: "007",
  rarity: "rare",
  lore: 2,
  text: "A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn.",
  abilities: [
    wheneverACardIsPutIntoYourInkwell({
      name: "A Greater Purpose",
      text: "During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn.",
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 1,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: thisCharacter,
        },
      ],
    }),
  ],
};
