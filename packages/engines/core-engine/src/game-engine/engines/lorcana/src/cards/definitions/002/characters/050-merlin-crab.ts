import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { whenPlayAndWhenLeaves } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const merlinCrab: LorcanitoCharacterCardDefinition = {
  id: "gxt",
  name: "Merlin",
  title: "Crab",
  characteristics: ["sorcerer", "storyborn", "mentor"],
  text: "**READY OR NOT!** When you play this character and when he leaves play, chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
  type: "character",
  abilities: whenPlayAndWhenLeaves({
    name: "READY OR NOT!",
    text: "When you play this character and when he leaves play, chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
    effects: [
      {
        type: "ability",
        ability: "challenger",
        amount: 3,
        modifier: "add",
        duration: "turn",
        target: chosenCharacter,
      },
    ],
  }),
  flavour: "He'll be out of this in a snap!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  number: 50,
  set: "ROF",
  rarity: "common",
  illustrator: "Valentina Graziuso",
};
