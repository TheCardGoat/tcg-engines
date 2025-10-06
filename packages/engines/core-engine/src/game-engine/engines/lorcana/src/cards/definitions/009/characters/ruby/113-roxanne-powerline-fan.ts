import { whileYouHaveCharacterWithAbility } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const roxannePowerlineFan: LorcanitoCharacterCardDefinition = {
  id: "rpf",
  name: "Roxanne",
  title: "Powerline Fan",
  characteristics: ["storyborn"],
  text: "CONCERT LOVER While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
  type: "character",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 2,
  willpower: 3,
  illustrator: "",
  number: 113,
  set: "009",
  rarity: "common",
  abilities: [
    whileConditionThisCharacterGets({
      name: "CONCERT LOVER",
      text: "While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
      attribute: "lore",
      amount: 1,
      conditions: [whileYouHaveCharacterWithAbility("singer")],
    }),
    whileConditionThisCharacterGets({
      name: "CONCERT LOVER",
      text: "While you have a character with Singer in play, this character gets +1 {S} and +1 {L}.",
      attribute: "strength",
      amount: 1,
      conditions: [whileYouHaveCharacterWithAbility("singer")],
    }),
  ],
  lore: 1,
};
