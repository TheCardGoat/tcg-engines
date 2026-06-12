import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaWarriorOfKumandraI18n } from "./124-raya-warrior-of-kumandra.i18n";

export const rayaWarriorOfKumandra: CharacterCard = {
  id: "NXq",
  canonicalId: "ci_NXq",
  reprints: ["set2-124"],
  cardType: "character",
  name: "Raya",
  version: "Warrior of Kumandra",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 124,
  rarity: "uncommon",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_13f1e523e8454e648cda03bba3603643",
    tcgPlayer: 516427,
  },
  classifications: ["Storyborn", "Hero", "Princess"],
  i18n: rayaWarriorOfKumandraI18n,
};
