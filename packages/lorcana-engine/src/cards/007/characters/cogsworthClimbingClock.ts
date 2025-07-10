import { haveItemInDiscard } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";

export const cogsworthClimbingClock: LorcanitoCharacterCard = {
  id: "lwo",
  name: "Cogsworth",
  title: "Climbing Clock",
  characteristics: ["storyborn", "ally"],
  text: "STILL USEFUL While you have an item card in your discard, this character gets +2 {S}.",
  type: "character",
  abilities: [
    whileConditionThisCharacterGets({
      name: "STILL USEFUL",
      text: "While you have an item card in your discard, this character gets +2 {S}.",
      conditions: [haveItemInDiscard],
      // @ts-ignore
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 3,
  willpower: 3,
  illustrator: "Tony Bancroft / Lindsay Weyman",
  number: 130,
  set: "007",
  rarity: "uncommon",
  lore: 1,
};
