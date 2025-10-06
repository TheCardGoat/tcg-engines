import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";

export const heartOfAtlantis: LorcanaItemCardDefinition = {
  id: "cxw",
  missingTestCase: true,
  name: "Heart of Atlantis",
  characteristics: ["item"],
  text: "**LIFE GIVER** {E} – You pay 2 {I} less for the next character you play this turn.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "LIFE GIVER",
      costs: [{ type: "exert" }],
      text: " {E} – You pay 2 {I} less for the next character you play this turn.",
      effects: [youPayXLessToPlayNextCharThisTurn(2)],
    },
  ],
  flavour: "It's what's keeping you–all of Atlantis–alive! \n–Milo Thatch",
  colors: ["amber"],
  cost: 4,
  illustrator: "Elliot Baum / Viv Tanner",
  number: 30,
  set: "ITI",
  rarity: "rare",
};
