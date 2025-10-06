import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
import {
  resistAbility,
  shiftAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cinderellaStouthearted: LorcanaCharacterCardDefinition = {
  id: "m9m",
  name: "Cinderella",
  title: "Stouthearted",
  characteristics: ["hero", "floodborn", "princess", "knight"],
  type: "character",
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Cinderella.)_<br>\n**Resist** +2 _(Damage dealt to this character is reduced by 2.)_<br>\n**THE SINGING SWORD** Whenever you play a song, this character may challenge ready characters this turn.",
  abilities: [
    shiftAbility(5, "cinderella"),
    resistAbility(2),
    whileConditionThisCharacterGains({
      name: "The Singing Sword",
      text: "Whenever you play a song, this character may challenge ready characters this turn.",
      conditions: [{ type: "played-songs" }],
      ability: {
        type: "static",
        ability: "challenge-ready-chars",
      },
    }),
  ],
  flavour: "Courage in the face of adversity.",
  inkwell: true,
  colors: ["steel"],
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  illustrator: "Grace Tran",
  number: 177,
  set: "ROF",
  rarity: "super_rare",
};
