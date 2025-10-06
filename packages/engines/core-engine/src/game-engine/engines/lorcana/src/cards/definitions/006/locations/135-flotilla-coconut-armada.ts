import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
import {
  opponentLoseLore,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";
import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import { ifYouHaveACharacterHere } from "~/game-engine/engines/lorcana/src/abilities/conditions/conditions";

export const flotillaCoconutArmada: LorcanaLocationCardDefinition = {
  id: "twz",
  missingTestCase: true,
  name: "Flotilla",
  title: "Coconut Armada",
  characteristics: ["location"],
  text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
  type: "location",
  abilities: [
    atTheStartOfYourTurn({
      name: "Tiny Thieves",
      text: "At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
      conditions: [ifYouHaveACharacterHere],
      effects: [youGainLore(1), opponentLoseLore(1)],
    }),
  ],
  inkwell: false,
  colors: ["ruby"],
  cost: 2,
  willpower: 6,
  moveCost: 2,
  illustrator: "Jiahui Eva Gao",
  number: 135,
  set: "006",
  rarity: "rare",
};
