import {
  chosenOpposingCharacterGainsRecklessDuringNextTurn,
  chosenOpposingCharacterLoseStrengthUntilNextTurn,
} from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kaaHypnotizingPython: LorcanaCharacterCardDefinition = {
  id: "weo",
  name: "Kaa",
  title: "Hypnotizing Python",
  characteristics: ["storyborn", "villain"],
  text: "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
  type: "character",
  abilities: [
    wheneverThisCharacterQuests({
      name: "LOOK ME IN THE EYE",
      text: "Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
      effects: [
        chosenOpposingCharacterLoseStrengthUntilNextTurn(2),
        chosenOpposingCharacterGainsRecklessDuringNextTurn,
      ],
    }),
  ],
  inkwell: false,
  colors: ["amber", "emerald"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Francesco D'Ippolito / Malià Evart",
  number: 21,
  set: "008",
  rarity: "uncommon",
  lore: 2,
};
