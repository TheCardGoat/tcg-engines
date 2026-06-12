import type { CharacterCard } from "@tcg/lorcana-types";
import { archimedesElectrifiedOwlI18n } from "./047-archimedes-electrified-owl.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";
import { challenger } from "../../../helpers/abilities/challenger";

export const archimedesElectrifiedOwl: CharacterCard = {
  id: "IT1",
  canonicalId: "ci_CCb",
  reprints: ["set5-047"],
  cardType: "character",
  name: "Archimedes",
  version: "Electrified Owl",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 47,
  rarity: "uncommon",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_cb38cec5fa8e49139bb0377111d6d048",
    tcgPlayer: 561977,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Evasive",
    },
    {
      title: "Challenger +3",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [shift(3), evasive, challenger(3)],
  i18n: archimedesElectrifiedOwlI18n,
};
