import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whileCharacterIsAtLocationItGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const minnieMouseFunkySpelunker: LorcanitoCharacterCardDefinition = {
  id: "h35",
  name: "Minnie Mouse",
  title: "Funky Spelunker",
  characteristics: ["hero", "dreamborn"],
  text: "**JOURNEY** While this character is at a location, she gets +2 {S}.",
  type: "character",
  abilities: [
    whileCharacterIsAtLocationItGets({
      name: "Journey",
      text: "While this character is at a location, she gets +2 {S}.",
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
  flavour: "She'll never cave under pressure.",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  willpower: 3,
  strength: 0,
  lore: 1,
  illustrator: "Grace Tran",
  number: 183,
  set: "ITI",
  rarity: "common",
};
