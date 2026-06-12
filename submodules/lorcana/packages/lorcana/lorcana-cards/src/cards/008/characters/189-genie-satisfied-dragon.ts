import type { CharacterCard } from "@tcg/lorcana-types";
import { genieSatisfiedDragonI18n } from "./189-genie-satisfied-dragon.i18n";

export const genieSatisfiedDragon: CharacterCard = {
  id: "0kv",
  canonicalId: "ci_0kv",
  reprints: ["set8-189"],
  cardType: "character",
  name: "Genie",
  version: "Satisfied Dragon",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 189,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1a915d634d8048febe7e324fa0c4730b",
    tcgPlayer: 633426,
  },
  text: [
    {
      title: "BUG CATCHER",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "ofy-1",
      name: "BUG CATCHER",
      text: "BUG CATCHER During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: genieSatisfiedDragonI18n,
};
