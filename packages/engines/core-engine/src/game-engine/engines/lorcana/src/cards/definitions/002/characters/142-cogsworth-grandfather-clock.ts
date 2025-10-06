import {
  resistAbility,
  shiftAbility,
  wardAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import { yourOtherCharacters } from "~/game-engine/engines/lorcana/src/abilities/target";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cogsworthGrandfatherClock: LorcanaCharacterCardDefinition = {
  id: "kv8",
  name: "Cogsworth",
  title: "Grandfather Clock",
  characteristics: ["floodborn", "ally"],
  text: "**Shift** 3 _You may pay 3 {I} to play this on top of one of your characters named Cogsworth.)_ **Ward** _(Opponents can't choose this character except to challenge.)_\n\n**UNWIND** Your other characters gain **Resist** +1 _(Damage dealt to them is reduced by 1.)_",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Unwind",
      text: "Your other characters gain **Resist** +1",
      gainedAbility: resistAbility(1),
      target: yourOtherCharacters,
    },
    wardAbility,
    shiftAbility(3, "cogsworth"),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  illustrator: "Isaiah Mesq",
  number: 142,
  set: "ROF",
  rarity: "super_rare",
};
