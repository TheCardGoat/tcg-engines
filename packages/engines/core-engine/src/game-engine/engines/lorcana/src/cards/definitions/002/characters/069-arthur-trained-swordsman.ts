import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arthurTrainedSwordsman: LorcanitoCharacterCardDefinition = {
  id: "ekd",

  name: "Arthur",
  title: "Trained Swordsman",
  characteristics: ["hero", "dreamborn"],
  type: "character",
  flavour:
    "It's not just fancy horses and swinging a sword around, you know! A true master must use his brain as well as his blade.\n−Merlin",
  inkwell: true,
  colors: ["emerald"],
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  illustrator: "Mario Oscar Gabriele",
  number: 69,
  set: "ROF",
  rarity: "common",
};
