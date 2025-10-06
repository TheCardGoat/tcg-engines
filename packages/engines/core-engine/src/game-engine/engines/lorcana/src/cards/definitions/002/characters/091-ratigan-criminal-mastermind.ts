import { evasiveAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/evasiveAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ratiganCriminalMastermind: LorcanitoCharacterCardDefinition = {
  id: "r5c",
  name: "Ratigan",
  title: "Criminal Mastermind",
  characteristics: ["dreamborn", "villain"],
  text: "**Evasive** _(Only characters with Evasive can challenge this character.)_",
  type: "character",
  abilities: [evasiveAbility],
  flavour:
    "I've outdone myself this time! Soon I will have everything I deserve. Riches . . . power . . . an entire kingdom at my feet!",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 2,
  illustrator: "Michaela Martin",
  number: 91,
  set: "ROF",
  rarity: "common",
};
