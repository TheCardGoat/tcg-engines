import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const healWhatHasBeenHurt: LorcanaActionCardDefinition = {
  id: "ao1",
  notImplemented: true,
  name: "Heal What Has Been Hurt",
  characteristics: ["action", "song"],
  text: "Remove up to 3 damage from chosen character. Draw a card.",
  type: "action",
  abilities: [],
  flavour: "Let your power shine \nMake the clock reverse . . .",
  inkwell: true,
  colors: ["amber"],
  cost: 3,
  illustrator: "Monica Catalano",
  number: 26,
  set: "ITI",
  rarity: "common",
};
