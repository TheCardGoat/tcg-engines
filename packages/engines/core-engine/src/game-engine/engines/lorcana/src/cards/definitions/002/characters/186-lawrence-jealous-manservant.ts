import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileThisCharacterHasNoDamageGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const lawrenceJealousManservant: LorcanitoCharacterCardDefinition = {
  id: "ytl",
  reprints: ["b85"],
  name: "Lawrence",
  title: "Jealous Manservant",
  characteristics: ["storyborn", "ally"],
  text: "**PAYBACK** While this character has no damage, he gets +4 {S}.",
  type: "character",
  abilities: [
    whileThisCharacterHasNoDamageGets({
      name: "Payback",
      text: "While this character has no damage, he gets +4 {S}.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 4,
          modifier: "add",
          duration: "static",
          target: thisCharacter,
        },
      ],
    }),
  ],
  flavour: "In this new world, the crown could finally be his.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  willpower: 4,
  strength: 0,
  lore: 2,
  illustrator: "Luis Huerta",
  number: 186,
  set: "ROF",
  rarity: "uncommon",
};
