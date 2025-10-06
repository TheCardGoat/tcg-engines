import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const viranaFangChief: LorcanaCharacterCardDefinition = {
  id: "ryo",
  reprints: ["q5j"],
  name: "Virana",
  title: "Fang Chief",
  characteristics: ["queen", "storyborn", "villain"],
  type: "character",
  flavour:
    "I must make the hard decisions to protect my daughter, especially in this unfamiliar world.",
  inkwell: true,
  colors: ["emerald"],
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "Mane Kandalyan / Luca Pinelli",
  number: 95,
  set: "ROF",
  rarity: "common",
};
