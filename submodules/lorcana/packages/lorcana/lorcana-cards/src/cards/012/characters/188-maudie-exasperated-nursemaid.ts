import type { CharacterCard } from "@tcg/lorcana-types";
import { maudieExasperatedNursemaidI18n } from "./188-maudie-exasperated-nursemaid.i18n";

import { resist } from "../../../helpers/abilities/resist";

export const maudieExasperatedNursemaid: CharacterCard = {
  id: "RqO",
  canonicalId: "ci_RqO",
  slug: "lorcana-ci_RqO",
  printings: [
    {
      id: "set12-188",
      artId: "set12-188",
      setCode: "set12",
      collectorNumber: "188",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set12-188"],
  cardType: "character",
  name: "Maudie",
  version: "Exasperated Nursemaid",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 188,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a70c450d25964e54b6aa7d03e0c08618",
    tcgPlayer: "692198",
  },
  text: "Resist +1",
  classifications: ["Storyborn"],
  abilities: [resist(1)],
  i18n: maudieExasperatedNursemaidI18n,
};
