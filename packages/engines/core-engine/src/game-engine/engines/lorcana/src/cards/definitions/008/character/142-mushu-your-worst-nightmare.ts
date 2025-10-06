import {
  theyGainEvasive,
  theyGainReckless,
  theyGainRush,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverTargetPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mushuYourWorstNightmare: LorcanaCharacterCardDefinition = {
  id: "eyj",
  name: "Mushu",
  title: "Your Worst Nightmare",
  characteristics: ["floodborn", "ally", "dragon"],
  text: "Shift 4\nALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn. ",
  type: "character",
  abilities: [
    shiftAbility(4, "Mushu"),
    wheneverTargetPlays({
      name: "ALL FIRED UP",
      text: "Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.",
      excludeSelf: true,
      triggerFilter: [
        { filter: "type", value: "character" },
        { filter: "owner", value: "self" },
      ],
      effects: [theyGainEvasive, theyGainRush, theyGainReckless],
    }),
  ],
  inkwell: true,
  colors: ["ruby", "steel"],
  cost: 6,
  strength: 4,
  willpower: 6,
  illustrator: "Jared Mathews",
  number: 142,
  set: "008",
  rarity: "rare",
  lore: 2,
};
