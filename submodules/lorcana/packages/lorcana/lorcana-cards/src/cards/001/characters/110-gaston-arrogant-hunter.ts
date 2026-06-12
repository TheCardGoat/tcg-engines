import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonArrogantHunterI18n } from "./110-gaston-arrogant-hunter.i18n";
import { reckless } from "../../../helpers/abilities/reckless";

export const gastonArrogantHunter: CharacterCard = {
  id: "sHc",
  canonicalId: "ci_pKT",
  reprints: ["set1-110", "set9-115"],
  cardType: "character",
  name: "Gaston",
  version: "Arrogant Hunter",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 110,
  rarity: "common",
  cost: 2,
  strength: 4,
  willpower: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_6f87816bd3e042a4852e68f2d23a5807",
    tcgPlayer: 650051,
  },
  text: "Reckless",
  classifications: ["Storyborn", "Villain"],
  abilities: [reckless],
  i18n: gastonArrogantHunterI18n,
};
