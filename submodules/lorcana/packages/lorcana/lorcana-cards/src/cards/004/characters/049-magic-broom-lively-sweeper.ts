import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomLivelySweeperI18n } from "./049-magic-broom-lively-sweeper.i18n";

export const magicBroomLivelySweeper: CharacterCard = {
  id: "9ap",
  canonicalId: "ci_9ap",
  reprints: ["set4-049"],
  cardType: "character",
  name: "Magic Broom",
  version: "Lively Sweeper",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "004",
  cardNumber: 49,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_bdc1291ed02b4526802da87554f615fd",
    tcgPlayer: 550567,
  },
  classifications: ["Dreamborn", "Broom"],
  i18n: magicBroomLivelySweeperI18n,
};
