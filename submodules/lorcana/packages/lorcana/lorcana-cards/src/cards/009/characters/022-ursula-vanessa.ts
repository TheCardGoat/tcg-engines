import type { CharacterCard } from "@tcg/lorcana-types";
import { ursulaVanessaI18n } from "./022-ursula-vanessa.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const ursulaVanessa: CharacterCard = {
  id: "JP7",
  canonicalId: "ci_hSt",
  slug: "lorcana-ci_hSt",
  printings: [
    {
      id: "set9-022",
      artId: "set9-022",
      setCode: "set9",
      collectorNumber: "22",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-025", "set9-022"],
  cardType: "character",
  name: "Ursula",
  version: "Vanessa",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 22,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_357824b1398340d8979b1ead1c7ff44f",
    tcgPlayer: "649970",
  },
  text: "Singer 4",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [singer(4)],
  i18n: ursulaVanessaI18n,
};
