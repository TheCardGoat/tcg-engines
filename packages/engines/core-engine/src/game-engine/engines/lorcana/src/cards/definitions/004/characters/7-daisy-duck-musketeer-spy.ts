import { discardACard } from "~/game-engine/engines/lorcana/src/abilities/effect";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckMusketeerSpy: LorcanaCharacterCardDefinition = {
  id: "w9s",
  reprints: ["ex3"],
  missingTestCase: true,
  name: "Daisy Duck",
  title: "Musketeer Spy",
  characteristics: ["hero", "dreamborn", "musketeer"],
  text: "**INFILTRATION** When you play this character, each opponent chooses and discards a card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "**INFILTRATION** When you play this character, each opponent chooses and discards a card.",
      optional: false,
      responder: "opponent",
      effects: [discardACard],
    },
  ],
  flavour: "She has a talent for thwarting hidden schemes.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 7,
  set: "URR",
  rarity: "common",
};
