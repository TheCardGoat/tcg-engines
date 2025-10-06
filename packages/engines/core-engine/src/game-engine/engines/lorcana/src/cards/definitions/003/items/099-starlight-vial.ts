import {
  discardACard,
  drawACard,
  youPayXLessToPlayNextActionThisTurn,
} from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const starlightVial: LorcanaItemCardDefinition = {
  id: "f2k",
  missingTestCase: true,
  name: "Starlight Vial",
  characteristics: ["item"],
  text: "**EFFICIENT ENERGY** {E} – You pay 2 {I} less for the next action you play this turn.\n\n\n**TRAP** 2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.",
  type: "item",
  abilities: [
    {
      type: "activated",
      costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
      name: "Trap",
      text: "2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.",
      resolveEffectsIndividually: true,
      effects: [discardACard, drawACard, drawACard],
    },
    {
      type: "activated",
      name: "**EFFICIENT ENERGY**",
      costs: [{ type: "exert" }],
      text: "{E} – You pay 2 {I} less for the next action you play this turn.",
      effects: [youPayXLessToPlayNextActionThisTurn(2)],
    },
  ],
  flavour: "In the wrong hands, this vial of magic could be disastrous.",
  colors: ["emerald"],
  illustrator: "Billy Wimblett",
  number: 99,
  set: "ITI",
  rarity: "rare",
  cost: 4,
};
