import type { CharacterCard } from "@tcg/lorcana-types";
import { jasmineDesertWarrior } from "./078-jasmine-desert-warrior";

export const jasmineDesertWarriorEnchanted: CharacterCard = {
  ...jasmineDesertWarrior,
  id: "LZl",
  reprints: ["set4-078"],
  set: "004",
  cardNumber: 212,
  rarity: "enchanted",
  specialRarity: "enchanted",
  externalIds: {
    lorcast: "crd_54e413e671dc4fa3872b3481db960d47",
    tcgPlayer: 551944,
  },
};
