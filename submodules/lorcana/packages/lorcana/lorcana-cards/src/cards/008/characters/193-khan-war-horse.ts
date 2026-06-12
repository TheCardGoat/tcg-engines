import type { CharacterCard } from "@tcg/lorcana-types";
import { khanWarHorseI18n } from "./193-khan-war-horse.i18n";

export const khanWarHorse: CharacterCard = {
  id: "9Tf",
  canonicalId: "ci_9Tf",
  reprints: ["set8-193"],
  cardType: "character",
  name: "Khan",
  version: "War Horse",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 193,
  rarity: "common",
  cost: 4,
  strength: 2,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_3ae06939a98a4e41a6c37b577aedd462",
    tcgPlayer: 631477,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: khanWarHorseI18n,
};
