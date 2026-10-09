import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoPickyCustomerI18n } from "./111-kuzco-picky-customer.i18n";

export const kuzcoPickyCustomer: CharacterCard = {
  id: "Cqh",
  canonicalId: "ci_Cqh",
  slug: "lorcana-ci_Cqh",
  printings: [
    {
      id: "set13-111",
      artId: "set13-111",
      setCode: "set13",
      collectorNumber: "111",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-111"],
  cardType: "character",
  name: "Kuzco",
  version: "Picky Customer",
  inkType: ["ruby"],
  franchise: "Emperors New Groove",
  set: "013",
  cardNumber: 111,
  rarity: "uncommon",
  cost: 2,
  strength: 5,
  willpower: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d09b95d2064147d49d77a02f63c0a011",
    tcgPlayer: "704621",
  },
  classifications: ["Storyborn", "King"],
  i18n: kuzcoPickyCustomerI18n,
};
