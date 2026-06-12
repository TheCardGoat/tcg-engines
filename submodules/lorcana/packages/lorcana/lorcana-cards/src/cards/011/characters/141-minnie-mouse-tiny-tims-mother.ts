import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseTinyTimsMotherI18n } from "./141-minnie-mouse-tiny-tims-mother.i18n";
import { support } from "../../../helpers/abilities/support";

export const minnieMouseTinyTimsMother: CharacterCard = {
  id: "4Kj",
  canonicalId: "ci_4Kj",
  reprints: ["set11-141"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Tiny Tim's Mother",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 141,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_33f12c74df68498cb444d6a493be67ef",
    tcgPlayer: 676221,
  },
  text: "Support",
  classifications: ["Storyborn", "Ally"],
  abilities: [support],
  i18n: minnieMouseTinyTimsMotherI18n,
};
