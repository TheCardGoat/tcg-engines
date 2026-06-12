import type { CharacterCard } from "@tcg/lorcana-types";
import { lawrenceJealousManservantI18n } from "./186-lawrence-jealous-manservant.i18n";

export const lawrenceJealousManservant: CharacterCard = {
  id: "W1g",
  canonicalId: "ci_HIY",
  reprints: ["set2-186", "set9-187"],
  cardType: "character",
  name: "Lawrence",
  version: "Jealous Manservant",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "002",
  cardNumber: 186,
  rarity: "uncommon",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9cba34a84bf04721aefd09dc1e87cb3a",
    tcgPlayer: 650120,
  },
  text: [
    {
      title: "PAYBACK",
      description: "While this character has no damage, he gets +4 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        modifier: 4,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1rx-1",
      name: "PAYBACK",
      text: "PAYBACK While this character has no damage, he gets +4 {S}.",
      type: "static",
    },
  ],
  i18n: lawrenceJealousManservantI18n,
};
