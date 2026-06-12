import type { LocationCard } from "@tcg/lorcana-types";
import { kuzcosPalaceHomeOfTheEmperorI18n } from "./102-kuzcos-palace-home-of-the-emperor.i18n";

export const kuzcosPalaceHomeOfTheEmperor: LocationCard = {
  id: "wbE",
  canonicalId: "ci_vRE",
  reprints: ["set3-102"],
  cardType: "location",
  name: "Kuzco's Palace",
  version: "Home of the Emperor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "003",
  cardNumber: 102,
  rarity: "uncommon",
  cost: 3,
  willpower: 7,
  moveCost: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a1af7dad15b64d31a696f7bbb49bfe92",
    tcgPlayer: 539165,
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
  i18n: kuzcosPalaceHomeOfTheEmperorI18n,
};
