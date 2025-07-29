import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { exertedCharCantReadyNextTurn } from "@lorcanito/lorcana-engine/effects/effects";

export const imStuck: LorcanitoActionCard = {
  id: "t6t",

  name: "I'm Stuck!",
  characteristics: ["action"],
  text: "Chosen exerted character can't ready at the start of their next turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Chosen exerted character can't ready at the start of their next turn.",
      effects: [exertedCharCantReadyNextTurn],
    },
  ],
  flavour: "Oh, bother−not again.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  illustrator: "Rob Di Salve",
  number: 63,
  set: "ROF",
  rarity: "common",
};
