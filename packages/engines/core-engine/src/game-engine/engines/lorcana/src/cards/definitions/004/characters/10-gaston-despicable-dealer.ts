import { youPayXLessToPlayNextCharThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gastonDespicableDealer: LorcanaCharacterCardDefinition = {
  id: "fzz",
  name: "Gaston",
  title: "Despicable Dealer",
  characteristics: ["storyborn", "villain"],
  text: "DUBIOUS RECRUITMENT  {E} − You pay 2 {I} less for the next character you play this turn.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "DUBIOUS RECRUITMENT",
      costs: [{ type: "exert" }],
      text: " {E} – You pay 2 {I} less for the next character you play this turn.",
      effects: [youPayXLessToPlayNextCharThisTurn(2)],
    },
  ],
  flavour:
    "Yes, yes, everything will be ready. Just make sure you do your part.",
  colors: ["amber"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Brian Kesinger",
  number: 10,
  set: "URR",
  rarity: "super_rare",
};
