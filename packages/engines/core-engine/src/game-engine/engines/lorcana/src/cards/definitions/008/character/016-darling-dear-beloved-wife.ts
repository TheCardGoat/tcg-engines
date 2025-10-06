import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { chosenCharacterGetLoreThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const darlingDearBelovedWife: LorcanaCharacterCardDefinition = {
  id: "kfn",
  name: "Darling Dear",
  title: "Beloved Wife",
  characteristics: ["storyborn", "ally"],
  text: "HOW SWEET When you play this character, chosen character gets +2 {L} this turn.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "HOW SWEET",
      text: "When you play this character, chosen character gets +2 {L} this turn.",
      effects: [chosenCharacterGetLoreThisTurn(2)],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 5,
  strength: 4,
  willpower: 4,
  illustrator: "Jake Murphy",
  number: 16,
  set: "008",
  rarity: "common",
  lore: 1,
};
