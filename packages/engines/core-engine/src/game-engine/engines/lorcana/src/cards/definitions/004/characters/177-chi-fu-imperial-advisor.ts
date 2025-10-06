import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileThisCharacterHasNoDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const chiFuImperialAdvisor: LorcanaCharacterCardDefinition = {
  id: "jnk",
  missingTestCase: true,
  name: "Chi-Fu",
  title: "Imperial Advisor",
  characteristics: ["storyborn", "ally"],
  text: "**OVERLY CAUTIOUS** While this character has no damage, he gets +2 {L}.",
  type: "character",
  abilities: [
    whileThisCharacterHasNoDamageGets({
      name: "Overly Cautious",
      text: "While this character has no damage, he gets +2 {L}.",
      effects: [
        {
          type: "attribute",
          attribute: "lore",
          amount: 2,
          modifier: "add",
          duration: "static",
          target: thisCharacter,
        },
      ],
    }),
  ],
  flavour:
    "You , there! Keep that fighting away from here! It is imperative that I write to the Emperor.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 0,
  willpower: 5,
  lore: 1,
  illustrator: "Gaku Kumatori",
  number: 177,
  set: "URR",
  rarity: "uncommon",
};
