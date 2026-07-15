import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyDaredevilI18n } from "./111-goofy-daredevil.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const goofyDaredevil: CharacterCard = {
  id: "nb3",
  canonicalId: "ci_nb3",
  slug: "lorcana-ci_nb3",
  printings: [
    {
      id: "set1-111",
      artId: "set1-111",
      setCode: "set1",
      collectorNumber: "111",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-111"],
  cardType: "character",
  name: "Goofy",
  version: "Daredevil",
  inkType: ["ruby"],
  set: "001",
  cardNumber: 111,
  rarity: "common",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6571a57fd39542b6945b43880bccc254",
    tcgPlayer: "490389",
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Hero"],
  abilities: [evasive],
  i18n: goofyDaredevilI18n,
};
