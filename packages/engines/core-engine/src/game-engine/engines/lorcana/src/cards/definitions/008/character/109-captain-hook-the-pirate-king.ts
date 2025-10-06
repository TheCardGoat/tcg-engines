import { duringYourTurn } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";
import {
  getStrengthThisTurn,
  targetCardGainsResist,
} from "~/game-engine/engines/lorcana/src/abilities/effect";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { allYourCharacteristicCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverOppCharIsDamaged } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const captainHookThePirateKing: LorcanaCharacterCardDefinition = {
  id: "kfs",
  name: "Captain Hook",
  title: "The Pirate King",
  characteristics: ["floodborn", "villain", "king", "pirate", "captain"],
  text: "SHIFT 3 (You may pay 3 {I} to play this on top of one of your characters named Captain Hook.)\nGIVE 'EM ALL YOU GOT! Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
  type: "character",
  abilities: [
    shiftAbility(3, "Captain Hook"),
    wheneverOppCharIsDamaged({
      name: "GIVE 'EM ALL YOU GOT!",
      text: "Once during your turn, whenever an opposing character is damaged, your Pirate characters get +2 {S} and gain Resist +2 this turn. (Damage dealt to them is reduced by 2.)",
      oncePerTurn: true,
      effects: [
        targetCardGainsResist({
          amount: 2,
          duration: "turn",
          target: allYourCharacteristicCharacters(["pirate"]),
        }),
        getStrengthThisTurn(2, allYourCharacteristicCharacters(["pirate"])),
      ],
      conditions: [duringYourTurn],
    }),
  ],
  inkwell: true,
  colors: ["emerald", "steel"],
  cost: 5,
  strength: 4,
  willpower: 5,
  illustrator: "Kenneth Anderson",
  number: 109,
  set: "008",
  rarity: "rare",
  lore: 2,
};
