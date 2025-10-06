import { banishThisCharacter } from "@lorcanito/lorcana-engine/effects/effects";
import { atTheEndOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { youDidntPutAnyCardsIntoYourInkwellThisTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { wardAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/wardAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ratiganGreedyGenius: LorcanaCharacterCardDefinition = {
  id: "m7c",
  name: "Ratigan",
  title: "Greedy Genius",
  characteristics: ["storyborn", "villain"],
  text: "Ward\nTIME RUNS OUT At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
  type: "character",
  abilities: [
    wardAbility,
    atTheEndOfYourTurn({
      name: "TIME RUNS OUT",
      text: "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
      conditions: [youDidntPutAnyCardsIntoYourInkwellThisTurn],
      effects: [banishThisCharacter],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 8,
  strength: 6,
  willpower: 7,
  illustrator: "Matthew Robert Davies",
  number: 167,
  set: "008",
  rarity: "legendary",
  lore: 4,
};
