import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { rushAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/rushAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const powerlineMusicalSuperstar: LorcanaCharacterCardDefinition = {
  id: "e1k",
  name: "Powerline",
  title: "Musical Superstar",
  characteristics: ["storyborn"],
  text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn.",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 4,
  willpower: 3,
  illustrator: "Kenneth Andersson",
  number: 117,
  set: "009",
  rarity: "rare",
  lore: 1,
  abilities: [
    whileConditionThisCharacterGains({
      name: "ELECTRIC MOVE",
      text: "If you've played a song this turn, this character gains Rush this turn.",
      conditions: [{ type: "played-songs" }],
      ability: rushAbility,
    }),
  ],
};
