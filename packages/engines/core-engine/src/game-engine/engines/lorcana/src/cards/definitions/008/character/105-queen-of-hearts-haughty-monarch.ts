import { whileThereAreXOrMoreDamagedCharacter } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import { thisCharacterGetsLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const queenOfHeartsHaughtyMonarch: LorcanaCharacterCardDefinition = {
  id: "jkc",
  name: "Queen Of Hearts",
  title: "Haughty Monarch",
  characteristics: ["storyborn", "villain", "queen"],
  text: "COUNT OFF! While there are 5 or more characters with damage in play, this character gets +3 {L}.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "COUNT OFF!",
      text: "While there are 5 or more characters with damage in play, this character gets +3 {L}.",
      conditions: [whileThereAreXOrMoreDamagedCharacter(5)],
      effects: [thisCharacterGetsLore(3)],
    },
  ],
  inkwell: true,
  colors: ["emerald", "ruby"],
  cost: 4,
  strength: 2,
  willpower: 3,
  illustrator: "Gonzalo Kenny",
  number: 105,
  set: "008",
  rarity: "super_rare",
  lore: 3,
};
