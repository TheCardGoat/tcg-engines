import type { CharacterCard } from "@tcg/lorcana-types";
import { gastonBaritoneBullyI18n } from "./008-gaston-baritone-bully.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const gastonBaritoneBully: CharacterCard = {
  id: "Rc3",
  canonicalId: "ci_Rc3",
  reprints: ["set2-008"],
  cardType: "character",
  name: "Gaston",
  version: "Baritone Bully",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 8,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_88ec6886b1a0481c9ab402049d1649e8",
    tcgPlayer: 527713,
  },
  text: "Singer 5",
  classifications: ["Dreamborn", "Villain"],
  abilities: [singer(5)],
  i18n: gastonBaritoneBullyI18n,
};
