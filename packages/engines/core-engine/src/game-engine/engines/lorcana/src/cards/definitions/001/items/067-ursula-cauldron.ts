import { putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck } from "@lorcanito/lorcana-engine/effects/effects";
import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const ursulaCaldron: LorcanaItemCardDefinition = {
  characteristics: ["item"],
  id: "fkd",

  name: "Ursula's Cauldron",
  text: "**PEER INTO THE DEPTHS** {E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Peer Into The Depths",
      text: "{E} − Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
      costs: [{ type: "exert" }],
      effects: [putOneOnTheTopAndTheOtherOnTheBottomOfYourDeck],
    } as ActivatedAbility,
  ],
  flavour: "Perfect for mixing potions and stealing voices.",
  colors: ["amethyst"],
  cost: 2,
  number: 67,
  set: "TFC",
  rarity: "uncommon",
  illustrator: "TBD",
};
