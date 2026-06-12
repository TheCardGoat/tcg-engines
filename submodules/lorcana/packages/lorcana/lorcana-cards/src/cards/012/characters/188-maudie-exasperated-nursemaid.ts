import type { CharacterCard } from "@tcg/lorcana-types";
import { maudieExasperatedNursemaidI18n } from "./188-maudie-exasperated-nursemaid.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const maudieExasperatedNursemaid: CharacterCard = {
  id: "RqO",
  canonicalId: "ci_RqO",
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
  },
  text: "Resist +1",
  abilities: [resist(1)],
  classifications: ["Storyborn"],
  i18n: maudieExasperatedNursemaidI18n,
};
