import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverYouPlayACharacter } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ladyDecisiveDog: LorcanaCharacterCardDefinition = {
  id: "ed3",
  name: "Lady",
  title: "Decisive Dog",
  characteristics: ["storyborn", "hero"],
  text: "PACK OF HER OWN Whenever you play a character, this character gets +1 {S} this turn.\nTAKE THE LEAD While this character has 3 {S} or more, she gets +2 {L}.",
  type: "character",
  abilities: [
    wheneverYouPlayACharacter({
      name: "PACK OF HER OWN",
      text: "Whenever you play a character, this character gets +1 {S} this turn.",
      effects: [thisCharacterGetsStrength(1)],
    }),
    whileConditionThisCharacterGets({
      name: "TAKE THE LEAD",
      text: "While this character has 3 {S} or more, she gets +2 {L}.",
      conditions: [
        {
          type: "attribute",
          attribute: "strength",
          comparison: { operator: "gte", value: 3 },
        },
      ],
      // @ts-ignore
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 2,
          modifier: "add",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber", "emerald"],
  cost: 1,
  strength: 0,
  willpower: 3,
  illustrator: "Therese Vildefall",
  number: 33,
  set: "008",
  rarity: "rare",
  lore: 1,
};
