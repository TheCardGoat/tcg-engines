import type { CharacterCard } from "@tcg/lorcana-types";
import { louieOneCoolDuckI18n } from "./001-louie-one-cool-duck.i18n";

export const louieOneCoolDuck: CharacterCard = {
  id: "s04",
  canonicalId: "ci_s04",
  reprints: ["set8-001"],
  cardType: "character",
  name: "Louie",
  version: "One Cool Duck",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "008",
  cardNumber: 1,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3fc64a6e60ce4fcd9688de5efd25cfea",
    tcgPlayer: 633427,
  },
  text: [
    {
      title: "SPRING THE TRAP",
      description:
        "While this character is being challenged, the challenging character gets -1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        role: "defender",
        type: "in-challenge",
      },
      effect: {
        modifier: -1,
        stat: "strength",
        target: {
          ref: "attacker",
        },
        type: "modify-stat",
      },
      id: "1h7-1",
      name: "SPRING THE TRAP",
      text: "SPRING THE TRAP While this character is being challenged, the challenging character gets -1 {S}.",
      type: "static",
    },
  ],
  i18n: louieOneCoolDuckI18n,
};
