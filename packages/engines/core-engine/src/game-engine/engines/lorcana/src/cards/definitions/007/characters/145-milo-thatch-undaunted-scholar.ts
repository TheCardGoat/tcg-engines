import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverYouPlayAnAction } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const miloThatchUndauntedScholar: LorcanaCharacterCardDefinition = {
  id: "j1p",
  name: "Milo Thatch",
  title: "Undaunted Scholar",
  characteristics: ["storyborn", "hero"],
  text: "I'M YOUR GUY Whenever you play an action, you may give chosen character +2 {S} this turn.",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 2,
  illustrator: "Stefano Zanchi",
  number: 145,
  set: "007",
  rarity: "rare",
  lore: 1,
  abilities: [
    wheneverYouPlayAnAction({
      name: "I'M YOUR GUY",
      text: "Whenever you play an action, you may give chosen character +2 {S} this turn.",
      optional: true,
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          duration: "turn",
          modifier: "add",
          target: chosenCharacter,
        },
      ],
    }),
  ],
};
