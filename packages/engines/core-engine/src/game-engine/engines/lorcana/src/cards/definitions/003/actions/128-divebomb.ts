import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const divebomb: LorcanaActionCardDefinition = {
  id: "zm8",
  missingTestCase: true,
  name: "Divebomb",
  characteristics: ["action"],
  text: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
      text: "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
      effects: [],
    },
  ],
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  illustrator: "Lisanne Koeteeuw",
  number: 128,
  set: "ITI",
  rarity: "uncommon",
};
