import {
  challengeReadyCharacters,
  duringYourTurnGains,
  evasiveAbility,
  recklessAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mulanChargingAhead: LorcanaCharacterCardDefinition = {
  id: "dsx",
  name: "Mulan",
  title: "Charging Ahead",
  characteristics: ["storyborn", "hero", "princess"],
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nBURST OF SPEED During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nLONG RANGE This character can challenge ready characters.",
  type: "character",
  abilities: [
    recklessAbility,
    duringYourTurnGains(
      "Burst of Speed",
      "During your turn, this character gains **Evasive**.",
      evasiveAbility,
    ),
    {
      ...challengeReadyCharacters,
      name: "Long Range",
      text: "This character can challenge ready characters.",
    },
  ],
  inkwell: false,
  colors: ["ruby", "steel"],
  cost: 4,
  strength: 3,
  willpower: 3,
  illustrator: "Gonzalo Kenny",
  number: 141,
  set: "008",
  rarity: "super_rare",
  lore: 0,
};
