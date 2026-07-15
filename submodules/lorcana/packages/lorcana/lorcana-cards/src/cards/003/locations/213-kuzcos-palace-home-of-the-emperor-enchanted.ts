import type { LocationCard } from "@tcg/lorcana-types";
import { kuzcosPalaceHomeOfTheEmperorEnchantedI18n } from "./213-kuzcos-palace-home-of-the-emperor-enchanted.i18n";

export const kuzcosPalaceHomeOfTheEmperorEnchanted: LocationCard = {
  id: "sFE",
  canonicalId: "ci_vRE",
  slug: "lorcana-ci_vRE",
  printings: [
    {
      id: "set3-213-enchanted",
      artId: "ci_vRE-enchanted",
      setCode: "set3",
      collectorNumber: "213",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-102"],
  cardType: "location",
  name: "Kuzco's Palace",
  version: "Home of the Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "003",
  cardNumber: 213,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  willpower: 7,
  moveCost: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a1af7dad15b64d31a696f7bbb49bfe92",
    tcgPlayer: "539165",
  },
  text: [
    {
      title: "CITY WALLS",
      description:
        "Whenever a character is challenged and banished while here, banish the challenging character.",
    },
  ],
  abilities: [
    {
      trigger: {
        event: "challenged-and-banished",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      effect: {
        target: {
          ref: "attacker",
        },
        type: "banish",
      },
      id: "aae-1",
      name: "CITY WALLS",
      text: "CITY WALLS Whenever a character is challenged and banished while here, banish the challenging character.",
      type: "triggered",
    },
  ],
  i18n: kuzcosPalaceHomeOfTheEmperorEnchantedI18n,
};
