import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theBareNecessities: LorcanaActionCardDefinition = {
  id: "vhx",
  notImplemented: true,
  name: "The Bare Necessities",
  characteristics: ["action", "song"],
  text: "_(A character with cost 2 or more can Exert.png to sing this song for free.)_\n\n\nChosen opponent reveals their hand and discards a non-character card of your choice.",
  type: "action",
  abilities: [],
  flavour: "Forget about your worries and your strife. . . .",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  illustrator: "Maxine Vee / David Navarro Arenas",
  number: 28,
  set: "ITI",
  rarity: "rare",
};
