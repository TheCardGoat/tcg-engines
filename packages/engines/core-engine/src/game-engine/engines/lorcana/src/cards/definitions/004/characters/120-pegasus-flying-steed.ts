import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const pegasusFlyingSteed: LorcanitoCharacterCardDefinition = {
  id: "u8h",
  name: "Pegasus",
  title: "Flying Steed",
  characteristics: ["ally", "storyborn"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour: "It zigs, it zags, what else do you need? \n−Phil",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  illustrator: "Kenneth Anderson",
  number: 120,
  set: "URR",
  rarity: "common",
};
