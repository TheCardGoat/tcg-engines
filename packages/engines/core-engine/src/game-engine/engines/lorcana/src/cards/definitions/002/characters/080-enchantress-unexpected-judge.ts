import { reverseChallenge } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const enchantressUnexpectedJudge: LorcanitoCharacterCardDefinition = {
  id: "xmq",
  reprints: ["b7r"],

  name: "Enchantress",
  title: "Unexpected Judge",
  characteristics: ["dreamborn", "sorcerer"],
  text: "**TRUE FORM** While being challenged, this character gets +2 {S}.",
  type: "character",
  abilities: [reverseChallenge("True Form", 2)],
  flavour: "Appearances can be deceiving.",
  inkwell: true,
  colors: ["emerald"],
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  illustrator: "Isaiah Mesq",
  number: 80,
  set: "ROF",
  rarity: "common",
};
