import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const self = {
  type: "player" as const,
  value: "self" as const,
};

export const hypnotize: LorcanaActionCardDefinition = {
  id: "awj",

  name: "Hypnotize",
  characteristics: ["action"],
  text: "Each opponent chooses and discards a card. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      optional: false,
      effects: [{ type: "draw", amount: 1, target: self }],
    },
    {
      type: "resolution",
      optional: false,
      responder: "opponent",
      effects: [discardACard],
    },
  ],
  flavour: "Look me in the eye when I'm speaking to you.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Lauren Levering",
  number: 98,
  set: "ROF",
  rarity: "common",
};
