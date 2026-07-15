import type { CharacterCard } from "@tcg/lorcana-types";
import { iagoPrettyPollyI18n } from "./040-iago-pretty-polly.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const iagoPrettyPolly: CharacterCard = {
  id: "lhS",
  canonicalId: "ci_lhS",
  slug: "lorcana-ci_lhS",
  printings: [
    {
      id: "set3-040",
      artId: "set3-040",
      setCode: "set3",
      collectorNumber: "40",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-040"],
  cardType: "character",
  name: "Iago",
  version: "Pretty Polly",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  cardNumber: 40,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c6206520d53f48a7ba4b32af8ca6cf66",
    tcgPlayer: "537407",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: iagoPrettyPollyI18n,
};
