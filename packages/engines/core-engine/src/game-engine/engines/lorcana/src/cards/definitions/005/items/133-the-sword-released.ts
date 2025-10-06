import {
  opponentLoseLore,
  youGainLore,
} from "@lorcanito/lorcana-engine/effects/effects";

import { atTheStartOfYourTurn } from "~/game-engine/engines/lorcana/src/abilities/atTheAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theSwordReleased: LorcanaItemCardDefinition = {
  id: "v7f",
  missingTestCase: true,
  name: "The Sword Released",
  characteristics: ["item"],
  text: "**POWER APPOINTED** At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
  type: "item",
  abilities: [
    atTheStartOfYourTurn({
      name: "Power Appointed",
      text: "At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
      conditions: [{ type: "have-strongest-character" }],
      effects: [youGainLore(1), opponentLoseLore(1)],
    }),
  ],
  colors: ["ruby"],
  cost: 3,
  illustrator: "Mario Oscar Gabriele",
  number: 133,
  set: "SSK",
  rarity: "rare",
};
